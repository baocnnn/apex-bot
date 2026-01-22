import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rewardsResponse, redemptionsResponse, userResponse] = await Promise.all([
        apiService.getRewards(),
        apiService.getMyRedemptions(),
        apiService.getCurrentUser(),
      ]);

      setRewards(rewardsResponse.data);
      setRedemptions(redemptionsResponse.data);
      setUser(userResponse.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId, pointCost) => {
    setMessage({ type: '', text: '' });

    if (user.points_balance < pointCost) {
      setMessage({ type: 'error', text: 'Not enough points!' });
      return;
    }

    try {
      await apiService.redeemReward(rewardId);
      setMessage({ type: 'success', text: 'Reward redeemed successfully!' });
      
      // Refresh data
      await fetchData();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to redeem reward' 
      });
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Rewards</h1>
        <div style={styles.pointsBadge}>
          You have {user.points_balance} points
        </div>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.success : styles.error}>
          {message.text}
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Available Rewards</h2>
        
        {rewards.length === 0 ? (
          <p style={styles.emptyMessage}>No rewards available yet.</p>
        ) : (
          <div style={styles.rewardGrid}>
            {rewards.map((reward) => (
              <div key={reward.id} style={styles.rewardCard}>
                <h3 style={styles.rewardName}>{reward.name}</h3>
                {reward.description && (
                  <p style={styles.rewardDescription}>{reward.description}</p>
                )}
                <div style={styles.rewardFooter}>
                  <span style={styles.cost}>{reward.point_cost} points</span>
                  <button
                    onClick={() => handleRedeem(reward.id, reward.point_cost)}
                    disabled={user.points_balance < reward.point_cost}
                    style={{
                      ...styles.redeemButton,
                      ...(user.points_balance < reward.point_cost ? styles.disabledButton : {}),
                    }}
                  >
                    {user.points_balance < reward.point_cost ? 'Not Enough Points' : 'Redeem'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Redemptions ({redemptions.length})</h2>
        
        {redemptions.length === 0 ? (
          <p style={styles.emptyMessage}>You haven't redeemed any rewards yet.</p>
        ) : (
          <div style={styles.redemptionList}>
            {redemptions.map((redemption) => (
              <div key={redemption.id} style={styles.redemptionCard}>
                <div style={styles.redemptionHeader}>
                  <h4 style={styles.redemptionName}>{redemption.reward.name}</h4>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: redemption.status === 'fulfilled' ? '#28a745' : '#ffc107',
                  }}>
                    {redemption.status}
                  </span>
                </div>
                <div style={styles.redemptionFooter}>
                  <span>{redemption.points_spent} points</span>
                  <span>{new Date(redemption.redeemed_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    margin: 0,
    color: '#333',
  },
  pointsBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
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
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  sectionTitle: {
    marginBottom: '20px',
    color: '#333',
  },
  emptyMessage: {
    color: '#666',
    textAlign: 'center',
    padding: '40px',
  },
  rewardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  rewardCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  rewardName: {
    margin: '0 0 10px 0',
    color: '#333',
  },
  rewardDescription: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '20px',
    flex: 1,
  },
  rewardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  cost: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007bff',
  },
  redeemButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  redemptionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  redemptionCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '15px',
  },
  redemptionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  redemptionName: {
    margin: 0,
    fontSize: '16px',
    color: '#333',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  redemptionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
  },
};

export default Rewards;