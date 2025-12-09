<template>
  <div class="comments-section">
    <h3>Comments ({{ comments.length }})</h3>
    
    <div v-if="comments.length === 0" class="no-comments">
      <p>No comments yet. Be the first to comment!</p>
    </div>
    
    <div v-else class="comments-list">
      <div v-for="comment in approvedComments" :key="comment.id" class="comment">
        <div class="comment-header">
          <strong class="comment-author">{{ comment.authorName }}</strong>
          <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>
    
    <div class="comment-form">
      <h4>Leave a Comment</h4>
      <form @submit.prevent="submitComment">
        <div class="form-group">
          <label for="authorName">Name *</label>
          <input
            id="authorName"
            v-model="form.authorName"
            type="text"
            required
            :disabled="submitting"
          />
        </div>
        
        <div class="form-group">
          <label for="authorEmail">Email *</label>
          <input
            id="authorEmail"
            v-model="form.authorEmail"
            type="email"
            required
            :disabled="submitting"
          />
        </div>
        
        <div class="form-group">
          <label for="content">Comment *</label>
          <textarea
            id="content"
            v-model="form.content"
            rows="5"
            required
            :disabled="submitting"
          ></textarea>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          Your comment has been submitted and is awaiting approval.
        </div>
        
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? 'Submitting...' : 'Submit Comment' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import commentsAPI from '../api/comments';

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  comments: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['comment-added']);

const form = ref({
  authorName: '',
  authorEmail: '',
  content: '',
});

const submitting = ref(false);
const error = ref('');
const success = ref(false);

const approvedComments = computed(() => {
  return props.comments.filter(comment => comment.isApproved);
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const submitComment = async () => {
  error.value = '';
  success.value = false;
  submitting.value = true;
  
  try {
    const commentData = {
      ...form.value,
      postId: props.postId,
      isApproved: false,
    };
    
    await commentsAPI.create(commentData);
    
    success.value = true;
    form.value = {
      authorName: '',
      authorEmail: '',
      content: '',
    };
    
    emit('comment-added');
    
    setTimeout(() => {
      success.value = false;
    }, 5000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to submit comment. Please try again.';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.comments-section h3 {
  margin-bottom: 1.5rem;
}

.no-comments {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.comments-list {
  margin-bottom: 2rem;
}

.comment {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-author {
  color: #333;
}

.comment-date {
  color: #666;
  font-size: 0.875rem;
}

.comment-content {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

.comment-form {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.comment-form h4 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.success-message {
  padding: 0.75rem;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.submit-btn {
  padding: 0.75rem 2rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
</style>
