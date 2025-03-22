// ./frontend/src/components/ColumnForm.jsx

import { useState } from 'react';
import '../styles/Form.css';

const ColumnForm = ({ 
  onSubmit, 
  initialValues = { name: '' }, 
  existingColumns = []
}) => {
  // Use a single state variable for the name instead of a formData object
  const [name, setName] = useState(initialValues.name || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested column names
  const suggestions = ['To Do', 'In Progress', 'Done', 'Backlog', 'Review', 'Testing', 'Deployed'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Column name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Column name must be at least 2 characters';
    } else if (name.trim().length > 30) {
      newErrors.name = 'Column name must be less than 30 characters';
    }
    
    // Check for duplicate column names
    const isDuplicate = existingColumns.some(
      column => column.name.toLowerCase() === name.trim().toLowerCase() && 
                column.id !== initialValues.id // Skip current column when editing
    );
    
    if (isDuplicate) {
      newErrors.name = 'A column with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit({ name });
      } catch (err) {
        console.error('Form submission error:', err);
        
        // Handle API error response if needed
        if (err.response && err.response.data && err.response.data.message) {
          if (err.response.data.message.includes('already exists')) {
            setErrors({ name: 'A column with this name already exists' });
          } else {
            setErrors({ name: err.response.data.message });
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion);
    if (errors.name) setErrors({...errors, name: null});
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Column Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({...errors, name: null});
          }}
          placeholder="e.g. To Do, In Progress, Done"
          className={errors.name ? 'error' : ''}
          disabled={isSubmitting}
          autoFocus
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
        
        <div className="form-helper">
          Name your column based on the stage of your tasks in the workflow.
        </div>
        
        <div className="suggestions">
          <div className="suggestions-label">Suggestions:</div>
          <div className="suggestions-chips">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isSubmitting}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
      
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
          initialValues.name ? 'Save Changes' : 'Create Column'
        )}
      </button>
    </form>
  );
};

export default ColumnForm;