from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    points_balance = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    praise_given = relationship("Praise", foreign_keys="Praise.giver_id", back_populates="giver")
    praise_received = relationship("Praise", foreign_keys="Praise.receiver_id", back_populates="receiver")
    redemptions = relationship("Redemption", back_populates="user")


class CoreValue(Base):
    __tablename__ = "core_values"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    
    # Relationships
    praises = relationship("Praise", back_populates="core_value")


class Praise(Base):
    __tablename__ = "praise"
    
    id = Column(Integer, primary_key=True, index=True)
    giver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    core_value_id = Column(Integer, ForeignKey("core_values.id"), nullable=False)
    points_awarded = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    giver = relationship("User", foreign_keys=[giver_id], back_populates="praise_given")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="praise_received")
    core_value = relationship("CoreValue", back_populates="praises")


class Reward(Base):
    __tablename__ = "rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    point_cost = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    redemptions = relationship("Redemption", back_populates="reward")


class Redemption(Base):
    __tablename__ = "redemptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reward_id = Column(Integer, ForeignKey("rewards.id"), nullable=False)
    points_spent = Column(Integer, nullable=False)
    status = Column(String, default="pending")  # pending, fulfilled
    redeemed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="redemptions")
    reward = relationship("Reward", back_populates="redemptions")