import enum

class UserTypeEnum(enum.Enum):
    user = "user"
    root = "root"
    admin = "admin"


class TwoFactorEnum(enum.Enum):
    sms = "sms"
    email = "email"
    authenticator = "authenticator"
    none = "none"


class BusinessKYCStatusEnum(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class PaymentFrequencyEnum(enum.Enum):
    daily = "daily"
    weekly = "weekly"
    biweekly = "bi-weekly"
    monthly = "monthly"

class AssetTypeEnum(enum.Enum):
    equipment = "equipment"
    vehicle = "vehicle"
    furniture = "furniture"
    electronics = "electronics"
    landed_property = "landed_property"
    other = "other"


class AssetConditionEnum(enum.Enum):
    new = "new"
    used = "used"
    refurbished = "refurbished"
    damaged = "damaged"
    other = "other"


class AssetStatusEnum(enum.Enum):
    available = "available"
    in_use = "in_use"
    leased = "leased"
    under_maintenance = "under_maintenance"
    retired = "retired"
    other = "other"

class TransactionTypeEnum(enum.Enum):
    customer_deposit = "customer_deposit"
    user_contribution = "user_contribution"
    payout = "payout"
    loan_out = "loan_out"
    loan_repayment = "loan_repayment"
    expense = "expense"
    income = "income"


class TransactionStatusEnum(enum.Enum):
    pending = "pending"
    completed = "completed"
    flagged = "flagged"
    failed = "failed"
    refunded = "refunded"
    cancelled = "cancelled"
    other = "other"