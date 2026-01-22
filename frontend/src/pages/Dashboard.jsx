import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Dashboard() {
  const [praise, setPraise] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all praise on component mount
  useEffect(() => {
    const fetchPraise = async () => {
      try {
        const response = await apiService.getAllPraise();
        setPraise(response.data);
      } catch (error) {
        console.error('Error fetching praise:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPraise();
  }, []);

  // Auto-rotate through praise every 4 seconds
  useEffect(() => {
    if (praise.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % praise.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [praise]);

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (praise.length === 0) {
    return (
      <div style={styles.container}>
        <h1>Dashboard</h1>
        <p>No praise yet! Be the first to give some.</p>
      </div>
    );
  }

  const currentPraise = praise[currentIndex];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Recent Praise</h1>
      
      <div style={styles.praiseCard}>
        <div style={styles.coreValue}>{currentPraise.core_value.name}</div>
        <p style={styles.message}>"{currentPraise.message}"</p>
        <div style={styles.meta}>
          <span style={styles.from}>
            From: {currentPraise.giver.first_name} {currentPraise.giver.last_name}
          </span>
          <span style={styles.to}>
            To: {currentPraise.receiver.first_name} {currentPraise.receiver.last_name}
          </span>
        </div>
        <div style={styles.points}>+{currentPraise.points_awarded} points</div>
      </div>

      <div style={styles.dots}>
        {praise.map((_, index) => (
          <span
            key={index}
            style={{
              ...styles.dot,
              backgroundColor: index === currentIndex ? '#007bff' : '#ddd',
            }}
          />
        ))}
      </div>

      <div style={styles.stats}>
        <p>Showing {currentIndex + 1} of {praise.length} recent praise</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#333',
  },
  praiseCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  coreValue: {
    color: '#007bff',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '20px',
    textAlign: 'center',
  },
  message: {
    fontSize: '24px',
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    margin: '20px 0',
    lineHeight: '1.5',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    color: '#666',
    fontSize: '14px',
  },
  from: {},
  to: {},
  points: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#28a745',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '30px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
  },
  stats: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
};

export default Dashboard;