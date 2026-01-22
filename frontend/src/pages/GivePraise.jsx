import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function GivePraise() {
  const [users, setUsers] = useState([]);
  const [coreValues, setCoreValues] = useState([]);
  const [formData, setFormData] = useState({
    receiver_id: '',
    message: '',
    core_value_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch users and core values on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, we'll need to add an endpoint to get all users
        // Let's fetch core values first
        const coreValuesResponse = await apiService.getCoreValues();
        setCoreValues(coreValuesResponse.data);

        // We'll manually set users for now (we need to add a /users endpoint to backend)
        // For the demo, let's just use hardcoded IDs
        setUsers([
          { id: 1, first_name: 'Chris', last_name: 'Smith' },
          { id: 2, first_name: 'Sarah', last_name: 'Johnson' },
        ]);
      } catch (err) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await apiService.givePraise({
        receiver_id: parseInt(formData.receiver_id),
        message: formData.message,
        core_value_id: parseInt(formData.core_value_id),
      });

      setSuccess(true);
      setFormData({ receiver_id: '', message: '', core_value_id: '' });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to give praise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Give Praise</h1>
        <p style={styles.subtitle}>Recognize a colleague for their great work!</p>

        {success && (
          <div style={styles.success}>
            Praise sent successfully! Redirecting to dashboard...
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Who are you praising?</label>
            <select
              name="receiver_id"
              value={formData.receiver_id}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select a person...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Which core value?</label>
            <select
              name="core_value_id"
              value={formData.core_value_id}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select a core value...</option>
              {coreValues.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write why you're giving this praise..."
              rows="5"
              style={styles.textarea}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Sending...' : 'Send Praise'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  select: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
};

export default GivePraise;