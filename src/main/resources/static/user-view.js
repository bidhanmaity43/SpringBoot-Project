document.addEventListener("DOMContentLoaded", () => {
    const postTableBody = document.getElementById('post-table-body');
    const commentTableBody = document.getElementById('comment-table-body');
    const pagination = document.getElementById('pagination');
    const backButton = document.getElementById('back-button');
    const logoutButton = document.getElementById('logout-button');

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
                    <td><button class="comment-button" data-post-id="${post.id}">Comment</button></td>
                `;
                postTableBody.appendChild(row);

                // Add an event listener to load comments when a post row is clicked
                row.addEventListener('click', () => {
                    loadComments(post.id);
                });

                // Add an event listener to handle the "Comment" button click
                const commentButton = row.querySelector('.comment-button');
                commentButton.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent row click event from firing
                    const postIdToComment = event.target.dataset.postId;
                    // Redirect to the comment creation page with the postId as a query parameter
                    openCommentPage(postIdToComment);
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
                    `;
                    commentTableBody.appendChild(row);
                });
            } else {
                console.error('API response is not an array:', comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Function to open the comment creation page
    const openCommentPage = (postId) => {
        // Redirect to the comment creation page, passing the post ID as a query parameter
        window.location.href = `create-comment.html?postId=${postId}`;
    };

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
