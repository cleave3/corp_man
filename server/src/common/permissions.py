admin_permission_actions = {
    "view_users": "admin.view_users",
    "update_users": "admin.update_users",
    "create_admin": "admin.create_admin",
    "view_admin": "admin.view_admin",
    "update_admin": "admin.update_admin",
    "delete_admin": "admin.delete_admin",
    "view_plan": "subscription.view_plan",
    "modify_user_subscription": "subscription.modify_user_subscription",
    "view_transactions": "subscription.view_transactions",
    "view_settings": "settings.view",
    "modify_settings": "settings.modify",
}

admin_permission_list = {
    "users": [
        {"name": "view users", "action": admin_permission_actions["view_users"]},
        {"name": "update users", "action": admin_permission_actions["update_users"]},
    ],
    "admin": [
        {"name": "update admin", "action": admin_permission_actions["update_admin"]},
        {"name": "create admin", "action": admin_permission_actions["create_admin"]},
        {"name": "view admin", "action": admin_permission_actions["view_admin"]},
        {"name": "delete admin", "action": admin_permission_actions["delete_admin"]},
    ],
    "subscription": [
        {
            "name": "Modify User Subscription",
            "action": admin_permission_actions["modify_user_subscription"],
        },
        {"name": "view plan", "action": admin_permission_actions["view_plan"]},
        {
            "name": "view transactions",
            "action": admin_permission_actions["view_transactions"],
        },
    ],
    "settings": [
        {"name": "View settings", "action": admin_permission_actions["view_settings"]},
        {
            "name": "Modify settings",
            "action": admin_permission_actions["modify_settings"],
        },
    ],
}

user_permission_actions = {
    "dashboard_overview": "dashboard.overview",
    "dashboard_revenue": "dashboard.revenue",
    "dashboard_target": "dashboard.target",
    "dashboard_due_payments": "dashboard.due_payments",
    "dashboard_notifications": "dashboard.notifications",
    "dashboard_pending": "dashboard.pending",
    "view_users": "user.view",
    "update_user": "user.update",
    "create_user": "user.create",
    "delete_user": "user.delete",
    "view_customers": "customer.view",
    "update_customers": "customer.update",
    "create_customers": "customer.create",
    "delete_customers": "customer.delete",
    "view_balances": "customer.view_balances",
    "update_business": "business.update",
    "view_business": "business.view",
    "update_business_preferences": "business.update_preferences",
    "view_transactions": "transaction.view",
    "initiate_transaction": "transaction.initiate",
    "approve_transaction": "transaction.approve",
    "view_settings": "settings.view",
    "modify_settings": "settings.modify",
}

user_permission_list = {
    "business": [
        {
            "name": "view business information",
            "action": user_permission_actions["view_business"],
        },
        {
            "name": "update business information",
            "action": user_permission_actions["update_business"],
        },
        {
            "name": "update business preferences",
            "action": user_permission_actions["update_business_preferences"],
        },
    ],
    "customers": [
        {
            "name": "update customers",
            "action": user_permission_actions["update_customers"],
        },
        {
            "name": "create customers",
            "action": user_permission_actions["create_customers"],
        },
        {"name": "view customers", "action": user_permission_actions["view_customers"]},
        {
            "name": "delete customers",
            "action": user_permission_actions["delete_customers"],
        },
        {"name": "view balances", "action": user_permission_actions["view_balances"]},
    ],
    "dashboard": [
        {
            "name": "view overview",
            "action": user_permission_actions["dashboard_overview"],
        },
        {
            "name": "view revenue",
            "action": user_permission_actions["dashboard_revenue"],
        },
        {
            "name": "view target",
            "action": user_permission_actions["dashboard_target"],
        },
        {
            "name": "view due payments",
            "action": user_permission_actions["dashboard_due_payments"],
        },
        {
            "name": "view notifications",
            "action": user_permission_actions["dashboard_notifications"],
        },
        {
            "name": "view pending transactions",
            "action": user_permission_actions["dashboard_pending"],
        },
    ],
    "settings": [
        {"name": "View settings", "action": user_permission_actions["view_settings"]},
        {
            "name": "Modify settings",
            "action": user_permission_actions["modify_settings"],
        },
    ],
    "transaction": [
        {
            "name": "view transactions",
            "action": user_permission_actions["view_transactions"],
        },
        {
            "name": "initiate transactions",
            "action": user_permission_actions["initiate_transaction"],
        },
        {
            "name": "Approve transactions",
            "action": user_permission_actions["approve_transaction"],
        },
    ],
    "user": [
        {"name": "update user", "action": user_permission_actions["update_user"]},
        {"name": "create user", "action": user_permission_actions["create_user"]},
        {"name": "view user", "action": user_permission_actions["view_users"]},
        {"name": "delete user", "action": user_permission_actions["delete_user"]},
    ],
}

root_user_permissions = [
    "dashboard.overview",
    "dashboard.revenue",
    "dashboard.target",
    "dashboard.due_payments",
    "dashboard.notifications",
    "dashboard.pending",
    "user.view",
    "user.update",
    "user.create",
    "user.delete",
    "customer.view",
    "customer.update",
    "customer.create",
    "customer.delete",
    "customer.view_balances",
    "business.update",
    "business.view",
    "business.update_preferences",
    "transaction.view",
    "transaction.initiate",
    "transaction.approve",
    "settings.view",
    "settings.modify",
]
