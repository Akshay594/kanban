// ./frontend/src/components/TaskForm.jsx

import { useState, useEffect } from 'react';
import '../styles/Form.css';

const TaskForm = ({ 
  onSubmit, 
  columns = [], 
  initialValues = { title: '', description: '', columnId: '' },
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    ...initialValues,
    columnId: initialValues.columnId || (columns.length > 0 ? columns[0].id : '')
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(initialValues.description?.length || 0);

  // Reset form when initialValues change
  useEffect(() => {
    setFormData({
      ...initialValues,
      columnId: initialValues.columnId || (columns.length > 0 ? columns[0].id : '')
    });
    setCharCount(initialValues.description?.length || 0);
  }, [initialValues, columns]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }
    
    if (!formData.columnId) {
      newErrors.columnId = 'Please select a column';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update character count for description
    if (name === 'description') {
      setCharCount(value.length);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (err) {
        console.error('Form submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Only show select if there are multiple columns
  const showColumnSelect = columns.length > 1;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Task Title <span className="required">*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Add authentication endpoints"
          className={errors.title ? 'error' : ''}
          disabled={isSubmitting}
          autoFocus
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description">
          Description
          <span className="char-count">{charCount}/500</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows="4"
          placeholder="e.g. Create login and signup endpoints with JWT authentication"
          disabled={isSubmitting}
          maxLength={500}
        />
        <div className="form-helper">
          Provide details about the task to help team members understand what needs to be done.
        </div>
      </div>
      
      {showColumnSelect && (
        <div className="form-group">
          <label htmlFor="columnId">Status <span className="required">*</span></label>
          <select
            id="columnId"
            name="columnId"
            value={formData.columnId}
            onChange={handleChange}
            className={errors.columnId ? 'error' : ''}
            disabled={isSubmitting}
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
          {errors.columnId && <div className="error-message">{errors.columnId}</div>}
        </div>
      )}
      
      <button 
        type="submit" 
        className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            <span>Processing...</span>
          </>
        ) : (
          isEdit ? 'Save Changes' : 'Create Task'
        )}
      </button>
    </form>
  );
};

export default TaskForm;