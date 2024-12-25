document.addEventListener("DOMContentLoaded", () => {
    const postTableBody = document.getElementById('post-table-body');
    const commentTableBody = document.getElementById('comment-table-body');
    const pagination = document.getElementById('pagination');
    const backButton = document.getElementById('back-button');
    const logoutButton = document.getElementById('logout-button');

    // Function to delete a post
    const deletePost = async (postId) => {
        try {
            const response = await fetch(`/api/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Post deleted successfully, remove the corresponding row from the table
                const rowToDelete = postTableBody.querySelector(`tr[data-post-id="${postId}"]`);
                if (rowToDelete) {
                    rowToDelete.remove();
                } else {
                    console.warn(`Post with ID ${postId} not found in the table.`);
                }

                // Reload the page to reflect the updated post list
                window.location.reload();
            } else {
                console.error('Error deleting post:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Function to delete a comment
    const deleteComment = async (postId, commentId) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Comment deleted successfully, remove the corresponding row from the table
                const rowToDelete = commentTableBody.querySelector(`tr[data-comment-id="${commentId}"]`);
                if (rowToDelete) {
                    rowToDelete.remove();
                } else {
                    console.warn(`Comment with ID ${commentId} not found in the table.`);
                }
                window.location.reload();
            } else {
                console.error('Error deleting comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const fetchPosts = async (pageNo = 0, pageSize = 5) => {
        try {
            const response = await fetch(`/api/post?pageNo=${pageNo}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error('Error fetching posts');
            }
            const data = await response.json();

            if (!data || !data.postDto || !Array.isArray(data.postDto)) {
                console.error('API response is not in the expected format:', data);
                return;
            }

            const posts = data.postDto;

            // Clear existing rows and pagination
            postTableBody.innerHTML = '';
            pagination.innerHTML = '';

            posts.forEach((post) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${post.id}</td>
                    <td>${post.title}</td>
                    <td>${post.description}</td>
                    <td>${post.content}</td>
                    <td><button class="delete-button custom-delete-button" data-post-id="${post.id}">Delete</button></td>
                `;
                postTableBody.appendChild(row);

                // Add an event listener to load comments when a post row is clicked
                row.addEventListener('click', () => {
                    loadComments(post.id);
                });

                // Add an event listener to handle delete button click
                const deleteButton = row.querySelector('.delete-button');
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const postIdToDelete = event.target.dataset.postId;
                    deletePost(postIdToDelete);
                });
            });

            const totalPages = data.totalPages;
            if (totalPages > 1) {
                for (let i = 0; i < totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.innerText = i + 1;
                    pageButton.classList.add('pagination-button');
                    pageButton.addEventListener('click', () => {
                        fetchPosts(i, pageSize);
                    });
                    if (i > 0) {
                        pageButton.style.marginLeft = '10px';
                    }
                    pagination.appendChild(pageButton);
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // ...

    const loadComments = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`);
            if (!response.ok) {
                throw new Error('Error fetching comments');
            }
            const comments = await response.json();

            commentTableBody.innerHTML = '';

            if (Array.isArray(comments)) {
                comments.forEach((comment) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${comment.id}</td>
                        <td>${comment.name}</td>
                        <td>${comment.email}</td>
                        <td>${comment.body}</td>
                        <td><button class="delete-comment-button custom-delete-button" data-comment-id="${comment.id}">Delete</button></td>
                    `;
                    commentTableBody.appendChild(row);

                    // Add an event listener to handle delete comment button click
                    const deleteCommentButton = row.querySelector('.delete-comment-button');
                    deleteCommentButton.addEventListener('click', async (event) => {
                        event.stopPropagation();
                        const commentIdToDelete = event.target.dataset.commentId;
                        deleteComment(postId, commentIdToDelete);
                    });
                });
            } else {
                console.error('API response is not an array:', comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // ...


    fetchPosts();

    backButton.addEventListener('click', () => {
        window.history.back();
    });

    logoutButton.addEventListener('click', async () => {
        try {
            const userToken = sessionStorage.getItem('userToken');
            console.log('JWT Token:', userToken);

            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Logout Response:', response);

            if (response.ok) {
                sessionStorage.removeItem('userToken');
                window.location.href = 'login.html';
            } else {
                console.error('Error logging out:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
});
