from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    points_balance: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Core Value Schemas
class CoreValueResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

# Praise Schemas
class PraiseCreate(BaseModel):
    receiver_id: int
    message: str
    core_value_id: int

class PraiseResponse(BaseModel):
    id: int
    giver_id: int
    receiver_id: int
    message: str
    core_value_id: int
    points_awarded: int
    created_at: datetime
    
    # Related objects
    giver: UserResponse
    receiver: UserResponse
    core_value: CoreValueResponse
    
    class Config:
        from_attributes = True
# Reward Schemas
class RewardCreate(BaseModel):
    name: str
    description: Optional[str] = None
    point_cost: int

class RewardResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    point_cost: int
    is_active: bool
    
    class Config:
        from_attributes = True

# Redemption Schemas
class RedemptionCreate(BaseModel):
    reward_id: int

class RedemptionResponse(BaseModel):
    id: int
    user_id: int
    reward_id: int
    points_spent: int
    status: str
    redeemed_at: datetime
    reward: RewardResponse
    
    class Config:
        from_attributes = True