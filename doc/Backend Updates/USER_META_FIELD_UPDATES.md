# User Meta Field Updates Documentation

This document details the recent updates to user meta field names and the addition of a new field in the BMH WordPress plugin.

## Field Name Changes

The following user meta fields have been renamed to better reflect their purpose:

| Old Field Name | New Field Name | Data Type | Description |
|----------------|----------------|-----------|-------------|
| `bmh_ecosystem_badge` | `bmh_across_campaign_badge` | string | Across campaign badge identifier |
| `bmh_ecosystem_badge_exp_date` | `bmh_across_campaign_badge_exp_date` | string | Across campaign badge expiration date |
| `bmh_fraud_flag` | `bmh_fraud_flag_count` | integer | Fraud flag counter (number of fraud incidents) |

## New Field Added

A new user meta field has been added and exposed to the `/profile` and `/signin` endpoints:

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `bmh_wallet_balance` | float | User's wallet balance |

## Affected Endpoints

The following endpoints have been updated to reflect the field name changes and the addition of the new field:

### 1. `/profile` Endpoint (GET/PUT)
- **GET**: Returns updated field names in the response
- **PUT**: Accepts updates using new field names

### 2. `/auth/signin` Endpoint (POST)
- Returns updated field names and new `bmh_wallet_balance` field in the response

### 3. `/auth/social-login` Endpoint (POST)
- Returns updated field names and new `bmh_wallet_balance` field in the response

### 4. `/auth/validate` Endpoint (POST)
- Returns updated field names and new `bmh_wallet_balance` field in the response

## Updated Response Structures

### Signin Response (Updated)
```typescript
interface SigninResponse {
  success: true;
  token: string; // JWT access token
  refresh_token: string; // Refresh token for getting new access tokens
  session_id: string; // Session identifier
  user_id: number; // WordPress user ID
  user_login: string; // WordPress username
  user_email: string; // User email address
  user_display_name: string; // User display name
  first_name: string; // User first name
  last_name: string; // User last name
  avatar_url: string; // URL to user avatar
  bmh_email_verified: boolean; // Email verification status
  bmh_referred_by: string; // Referral code or user ID
  bmh_across_campaign_badge: string; // Across campaign badge
  bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
  bmh_referral_count: number; // Referral count
  bmh_wallet_balance: number; // Wallet balance
  bmh_fraud_flag_count: number; // Fraud flag count
  role: string; // User role (subscriber, contributor, etc.)
}
```

### Validate Token Response (Updated)
```typescript
interface ValidateTokenResponse {
  valid: true;
  data: {
    user_id: number; // WordPress user ID
    bmh_email_verified: boolean; // Email verification status
    bmh_referred_by: string; // Referral code or user ID
    bmh_across_campaign_badge: string; // Across campaign badge
    bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
    bmh_referral_count: number; // Referral count
    bmh_wallet_balance: number; // Wallet balance
    bmh_fraud_flag_count: number; // Fraud flag count
    role: string; // User role
  };
}
```

### Get Profile Response (Updated)
```typescript
interface GetProfileResponse {
  id: number; // User ID
  username: string; // Username
  email: string; // Email address
  display_name: string; // Display name
  first_name: string; // First name
  last_name: string; // Last name
  avatar_url: string; // Avatar URL
  bmh_phone_number: string; // Phone number
  bmh_country: string; // Country
  bmh_state: string; // State
  bmh_referred_by: string; // Referred by
  bmh_role: string; // Role
  bmh_account_type: string; // Account type
  bmh_email_verified: boolean; // Email verified
  bmh_phone_verified: boolean; // Phone verified
  bmh_fraud_flag_count: number; // Fraud flag count
  bmh_device_id: string; // Device ID
  bmh_last_signin: number; // Last signin timestamp
  bmh_last_signout: number; // Last signout timestamp
  bmh_google_id: string; // Google ID
  bmh_facebook_id: string; // Facebook ID
  bmh_twitter_id: string; // Twitter ID
  bmh_across_campaign_badge: string; // Across campaign badge
  bmh_across_campaign_badge_exp_date: string; // Across campaign badge expiration date
  bmh_referral_count: number; // Referral count
  bmh_wallet_balance: number; // Wallet balance
  role: string; // User role
}
```

## Implementation Details

### Files Modified

1. **`includes/rest/controllers/class-bmh-user-controller.php`**
   - Updated field names in user profile retrieval and update methods
   - Added `bmh_wallet_balance` to exposed fields

2. **`includes/rest/controllers/class-bmh-auth-controller.php`**
   - Updated default values for new field names during user creation
   - Updated social login to use new field names

3. **`includes/rest/controllers/class-bmh-enhanced-auth-controller.php`**
   - Updated social login to use new field names

4. **`doc/API_DOCUMENTATION.md`**
   - Updated all API documentation to reflect new field names
   - Added `bmh_wallet_balance` and `bmh_fraud_flag_count` to response structures

## Migration Notes

When migrating existing data, ensure that:
1. All instances of `bmh_ecosystem_badge` are updated to `bmh_across_campaign_badge`
2. All instances of `bmh_ecosystem_badge_exp_date` are updated to `bmh_across_campaign_badge_exp_date`
3. All instances of `bmh_fraud_flag` are updated to `bmh_fraud_flag_count`
4. The new `bmh_wallet_balance` field is properly initialized for existing users

## Testing

All endpoints have been tested to ensure:
1. Field name changes are properly reflected in responses
2. New `bmh_wallet_balance` field is exposed in `/profile` and `/signin` endpoints
3. Update operations work correctly with new field names
4. Backward compatibility is maintained where necessary