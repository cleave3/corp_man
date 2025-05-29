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
    "view_users": "user.view",
    "update_user": "user.update",
    "create_user": "user.create",
    "delete_user": "user.delete",
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
    "user": [
        {"name": "update user", "action": user_permission_actions["update_user"]},
        {"name": "create user", "action": user_permission_actions["create_user"]},
        {"name": "view user", "action": user_permission_actions["view_users"]},
        {"name": "delete user", "action": user_permission_actions["delete_user"]},
    ],
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
    "settings": [
        {"name": "View settings", "action": user_permission_actions["view_settings"]},
        {
            "name": "Modify settings",
            "action": user_permission_actions["modify_settings"],
        },
    ],
}
