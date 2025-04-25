import uuid
from datetime import datetime
from typing import List, Optional
import sqlalchemy.dialects.postgresql as pg
from sqlmodel import Column, Field, Relationship, SQLModel
from src.common.enums import *


class AppModules(SQLModel, table=True):
    __tablename__ = "app_modules"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    name: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    description: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    permissions: List[str] = Field(
        sa_column=Column(pg.ARRAY(pg.VARCHAR), nullable=True, default=[])
    )
    is_active: bool = Field(sa_column=Column(pg.BOOLEAN, default=True))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<AppModules {self.id}>"


class AppConfig(SQLModel, table=True):
    __tablename__ = "app_config"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    name: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    value: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    description: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<AppConfig {self.id}>"


class Auth(SQLModel, table=True):
    __tablename__ = "auth"
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    email: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True, unique=True, default=None)
    )
    phone: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True, unique=True, default=None)
    )
    name: str = Field(sa_column=Column(pg.VARCHAR, nullable=True, default=None))
    user_type: UserTypeEnum = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, default=UserTypeEnum.root)
    )
    is_email_verified: bool = Field(
        sa_column=Column(pg.BOOLEAN, default=False, nullable=True)
    )
    is_phone_verified: bool = Field(
        sa_column=Column(pg.BOOLEAN, default=False, nullable=True)
    )
    two_factor_enabled: bool = Field(
        sa_column=Column(pg.BOOLEAN, default=False, nullable=True)
    )
    two_factor_option: TwoFactorEnum = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, default=TwoFactorEnum.none)
    )
    has_password: bool = Field(default=False, nullable=True)
    password_hash: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True, default=None), exclude=True
    )

    def __repr__(self):
        return f"<Auth {self.uid}>"


class AuthMetaData(SQLModel, table=True):
    __tablename__ = "auth_meta_data"
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    device_ip: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    device_name: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    device_os: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    device_browser: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    timezone: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    user_agent: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    login_time: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, nullable=False, default=datetime.now)
    )

    def __repr__(self):
        return f"<AuthMetaData {self.uid}>"


class Token(SQLModel, table=True):
    __tablename__ = "tokens"
    id: int = Field(sa_column=Column(pg.INTEGER, primary_key=True, autoincrement=True))
    identifier: str = Field(sa_column=Column(pg.VARCHAR, nullable=False, unique=True))
    token: str
    is_active: bool = Field(default=True)
    expiry: datetime = Field(sa_column=Column(pg.TIMESTAMP, nullable=False))

    def __repr__(self):
        return f"<Token {self.id}>"


class User(SQLModel, table=True):
    __tablename__ = "users"
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    business_id: str = Field(sa_column=Column(pg.VARCHAR, nullable=True, default=None))
    email: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True, unique=True, default=None)
    )
    phone: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True, unique=True, default=None)
    )
    first_name: str = Field(sa_column=Column(pg.VARCHAR, nullable=True, default=None))
    last_name: str = Field(sa_column=Column(pg.VARCHAR, nullable=True, default=None))
    image_url: str = Field(sa_column=Column(pg.VARCHAR, nullable=True, default=None))
    permissions: List[str] = Field(
        sa_column=Column(pg.ARRAY(pg.VARCHAR), nullable=True, default=[])
    )
    business: Optional["Business"] = Relationship(
        sa_relationship_kwargs={"back_populates": "users"}
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<User {self.uid}>"


class Business(SQLModel, table=True):
    __tablename__ = "businesses"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    business_name: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    business_address: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    business_phone: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    business_email: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    logo_url: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    business_type: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    business_nature: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    business_website: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    business_reg_no: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    certificate_url: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    modules: List[str] = Field(
        sa_column=Column(pg.ARRAY(pg.VARCHAR), nullable=True, default=[])
    )
    business_website: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    business_kyc_status: BusinessKYCStatusEnum = Field(
        sa_column=Column(
            pg.VARCHAR, nullable=False, default=BusinessKYCStatusEnum.pending
        )
    )
    business_users: List["User"] = Relationship(
        back_populates="business",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
    preferences: Optional["BusinessPreference"] = Relationship(
        back_populates="business",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<Business {self.id}>"


class BusinessPreference(SQLModel, table=True):
    __tablename__ = "business_preferences"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    business_id: uuid.UUID = Field(nullable=False, foreign_key="businesses.id")
    sms_notification: bool = Field(
        sa_column=Column(pg.BOOLEAN, nullable=False, default=False)
    )
    sms_id: str = Field(sa_column=Column(pg.VARCHAR, nullable=True, default=None))
    email_notification: bool = Field(
        sa_column=Column(pg.BOOLEAN, nullable=False, default=False)
    )
    require_two_factor: bool = Field(
        sa_column=Column(pg.BOOLEAN, nullable=False, default=False)
    )
    business: Business = Relationship(
        sa_relationship_kwargs={"back_populates": "preferences"}
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<BusinessPreference {self.id}>"


class Contribution(SQLModel, table=True):
    __tablename__ = "contributions"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    user_id: uuid.UUID = Field(nullable=False, foreign_key="users.uid")
    debit: float = Field(sa_column=Column(pg.FLOAT, nullable=False, default=0.0))
    credit: float = Field(sa_column=Column(pg.FLOAT, nullable=False, default=0.0))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

    def __repr__(self):
        return f"<Contribution {self.id}>"


class Customer(SQLModel, table=True):
    __tablename__ = "customers"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    business_id: uuid.UUID = Field(default=None, foreign_key="businesses.id")
    first_name: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    last_name: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    email: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    phone: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    image_url: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    address: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    payment_frequency: PaymentFrequencyEnum = Field(
        sa_column=Column(
            pg.VARCHAR, nullable=False, default=PaymentFrequencyEnum.monthly
        )
    )
    next_payment_date: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, nullable=True, default=datetime.now)
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<Customer {self.id}>"


class Wallet(SQLModel, table=True):
    __tablename__ = "wallets"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    customer_id: uuid.UUID = Field(nullable=False, foreign_key="customers.id")
    debit: float = Field(sa_column=Column(pg.FLOAT, nullable=False, default=0.0))
    credit: float = Field(sa_column=Column(pg.FLOAT, nullable=False, default=0.0))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

    def __repr__(self):
        return f"<Wallet {self.id}>"


class Asset(SQLModel, table=True):
    __tablename__ = "assets"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    business_id: uuid.UUID = Field(default=None, foreign_key="businesses.id")
    name: str = Field(sa_column=Column(pg.VARCHAR, nullable=False))
    description: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    value: float = Field(sa_column=Column(pg.FLOAT, nullable=False, default=0.0))
    images: List[str] = Field(
        sa_column=Column(pg.ARRAY(pg.VARCHAR), nullable=True, default=[])
    )
    purchase_date: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, nullable=False, default=datetime.now)
    )
    warranty_expiry_date: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, nullable=True, default=None)
    )
    asset_type: AssetTypeEnum = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, default=AssetTypeEnum.equipment)
    )
    asset_condition: AssetConditionEnum = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, default=AssetConditionEnum.new)
    )
    asset_status: AssetStatusEnum = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, default=AssetStatusEnum.available)
    )
    asset_location: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<Asset {self.id}>"


class TransactionTypeSetting(SQLModel, table=True):
    __tablename__ = "transaction_types_setting"
    id: int = Field(sa_column=Column(pg.INTEGER, primary_key=True, autoincrement=True))
    business_id: uuid.UUID = Field(default=None, foreign_key="businesses.id")
    type: TransactionTypeEnum = Field(
        sa_column=Column(
            pg.VARCHAR, nullable=False, default=TransactionTypeEnum.customer_deposit
        )
    )
    requires_approval: bool = Field(
        sa_column=Column(pg.BOOLEAN, nullable=False, default=False)
    )
    number_of_required_approval: int = Field(
        sa_column=Column(pg.INTEGER, nullable=False, default=0)
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    updated_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<TransactionTypeSetting {self.id}>"


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    business_id: uuid.UUID = Field(default=None, foreign_key="businesses.id")
    amount: float = Field(sa_column=Column(pg.FLOAT, nullable=False))
    transaction_type: TransactionTypeEnum = Field(
        sa_column=Column(
            pg.VARCHAR, nullable=False, default=TransactionTypeEnum.customer_deposit
        )
    )
    status: TransactionStatusEnum = Field(
        sa_column=Column(
            pg.VARCHAR, nullable=False, default=TransactionStatusEnum.pending
        )
    )
    description: str = Field(sa_column=Column(pg.VARCHAR, nullable=True))
    meta_data: dict = Field(sa_column=Column(pg.JSON, nullable=True))
    requires_approval: bool = Field(
        sa_column=Column(pg.BOOLEAN, nullable=False, default=False)
    )
    number_of_required_approval: int = Field(
        sa_column=Column(pg.INTEGER, nullable=False, default=0)
    )
    approvals: List["TransactionApproval"] = Relationship(
        back_populates="transaction",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    updated_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, default=datetime.now, onupdate=datetime.now)
    )

    def __repr__(self):
        return f"<Transaction {self.id}>"


class TransactionApproval(SQLModel, table=True):
    __tablename__ = "transaction_approvals"
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    transaction_id: uuid.UUID = Field(nullable=False, foreign_key="transactions.id")
    user_id: uuid.UUID = Field(nullable=False, foreign_key="users.uid")
    approver: Optional["User"] = Relationship(
        sa_relationship_kwargs={"lazy": "selectin"}
    )
    transaction: Transaction = Relationship(
        sa_relationship_kwargs={"back_populates": "approvals"}
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

    def __repr__(self):
        return f"<TransactionApproval {self.id}>"
