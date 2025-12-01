import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Pages/Loading";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addErrors, setAddErrors] = useState({ title: "", description: "" });
  const [editErrors, setEditErrors] = useState({ title: "", description: "" });
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "" });
  const [search, setSearch] = useState("");
  const postsPerPage = 5;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const usersRes = await fetch("/data/users.json");
        const postsRes = await fetch("/data/posts.json");

        const usersData = await usersRes.json();
        const postsData = await postsRes.json();

        const userIdNum = Number(id);
        setUser(usersData.find(u => u.id === userIdNum));
        setPosts(postsData.filter(p => p.userId === userIdNum));
      } catch (err) {
        setAlertModal({ show: true, message: "Failed to fetch data!", type: "danger" });
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);


  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
  }, [filteredPosts.length]);

  const handleAddPost = () => {
    let errors = {};
    let hasError = false;

    if (!newTitle.trim()) {
      errors.title = "Title is required";
      hasError = true;
    }
    if (!newDesc.trim()) {
      errors.description = "Description is required";
      hasError = true;
    }
    setAddErrors(errors);
    if (hasError) return;

    const newPost = {
      id: Date.now(),
      userId: user.id,
      title: newTitle,
      description: newDesc,
    };

    setPosts([newPost, ...posts]);
    setAddOpen(false);
    setNewTitle("");
    setNewDesc("");

    setAlertModal({
      show: true,
      message: "Post added successfully!",
      type: "success",
    });
  };

  const OpenEdit = (post) => {
    setEditPost(post);
    setEditTitle(post.title);
    setEditDesc(post.description);
    setEditErrors({ title: "", description: "" });
    setEditModal(true);
  }
  const handleEdit = () => {
    let errors = {};
    let hasError = false;

    if (!editTitle.trim()) {
      errors.title = "Title is required";
      hasError = true;
    }
    if (!editDesc.trim()) {
      errors.description = "Description is required";
      hasError = true;
    }

    setEditErrors(errors);
    if (hasError) return;
    setPosts(
      posts.map((p) =>
        p.id === editPost.id ? { ...p, title: editTitle, description: editDesc } : p
      )
    );

    setEditModal(false);
    setAlertModal({
      show: true,
      message: "Post updated successfully!",
      type: "success",
    });
  };

  const OpenDelete = (post) => {
    setDeletePost(post);
    setDeleteModal(true);
  }
  const handleDelete = () => {
    setPosts(posts.filter((p) => p.id !== deletePost.id));
    setDeleteModal(false);
    setAlertModal({ show: true, message: "Post deleted successfully!", type: "success" });
  };

  return (
    <div className="user-details-container">
      <div className="user-details-header">
        <Button startIcon={<ArrowBackIcon />} variant="outlined"
          className="user-details-back-btn"
          onClick={() => navigate("/")}>Back</Button>
        <Typography className="user-details-heading">User Details</Typography>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <Paper className="user-info-paper">
            <Typography className="user-info-heading">User Information</Typography>
            <div className="user-info-grid">
              <TextField label="Name" value={user.name} disabled />
              <TextField label="Email" value={user.email} disabled />
              <TextField label="Phone" value={user.phone} disabled />
              <TextField label="Website" value={user.website} disabled />
            </div>
          </Paper>

          <Paper className="user-posts-paper">
            <Typography className="user-info-heading">User Posts</Typography>
            <div className="search-add-container">
              <TextField
                size="small"
                placeholder="Search title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <Button variant="contained" onClick={() => setAddOpen(!addOpen)}>{addOpen ? "Close" : "Add Post"}</Button>
            </div>

            {addOpen && (
              <div className="add-post">
                <Paper className="add-post-paper">
                  <TextField fullWidth label="Title"
                    className="post-text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    error={Boolean(addErrors.title)}
                    helperText={addErrors.title}
                  />
                  <TextField fullWidth label="Description"
                    className="post-text" multiline rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    error={Boolean(addErrors.description)}
                    helperText={addErrors.description}
                  />
                  <div className="posts-button-group">
                    <Button variant="contained" color="success" onClick={handleAddPost}>Add</Button>
                    <Button variant="outlined" color="error"
                      onClick={() => {
                        setAddOpen(false);
                        setNewTitle("");
                        setNewDesc("");
                        setAddErrors({ title: "", description: "" });
                      }}>Cancel</Button>
                  </div>
                </Paper>
              </div>
            )}

            <TableContainer component={Paper}>
              <Table className="custom-table">
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell className="table-cell-title">Title</TableCell>
                    <TableCell className="table-cell-desc">Description</TableCell>
                    <TableCell className="table-cell-actions">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No posts found</TableCell>
                    </TableRow>
                  ) : (
                    currentPosts.map((post) => (
                      <TableRow key={post.id} className="table-row">
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.description}</TableCell>
                        <TableCell>
                          <div className="posts-table-actions">
                            <Button variant="outlined" size="small" onClick={() => OpenEdit(post)}>Edit</Button>
                            <Button variant="contained" color="error" size="small" onClick={() => OpenDelete(post)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>


            {totalPages > 0 && (
              <div className="pagination-container">
                <Button variant="outlined" disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}> Previous</Button>

                <Typography variant="body1" className="pagination-text">
                  Page {currentPage} of {totalPages}
                </Typography>

                <Button variant="outlined" disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)} > Next </Button>
              </div>
            )}
          </Paper>
        </>
      )}

      <Dialog open={editModal} onClose={() => setEditModal(false)} fullWidth maxWidth="sm">
        <DialogTitle className="dialog-title">
          Edit Post
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            error={Boolean(editErrors.title)}
            helperText={editErrors.title}
            className="dialog-textfield"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            error={Boolean(editErrors.description)}
            helperText={editErrors.description}
            className="dialog-textfield"
          />
        </DialogContent>
        <DialogActions className="dialog-actions-center">
          <Button variant="outlined" onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleEdit}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} fullWidth maxWidth="xs">
        <DialogTitle className="dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography className="dialog-content-text">Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions className="dialog-actions-center">
          <Button variant="outlined" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={alertModal.show}
        onClose={() => setAlertModal({ ...alertModal, show: false })} fullWidth maxWidth="xs">
        <DialogContent>
          <Typography className="dialog-content-text" style={{ color: alertModal.type === "danger" ? "red" : "green" }}
          >{alertModal.message}</Typography>
        </DialogContent>
        <DialogActions className="dialog-actions-center">
          <Button variant="contained" onClick={() => setAlertModal({ ...alertModal, show: false })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
export default UserDetails;