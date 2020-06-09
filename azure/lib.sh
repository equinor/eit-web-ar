#!/bin/bash


#######################################################################################
### PURPOSE
### 

# Library misc sh functions


function exit_if_user_does_not_have_required_az_role(){    
    local testOwner="$(az role assignment list --subscription ${AZ_SUBSCRIPTION_ID} --query "[?contains(roleDefinitionId,'${AZ_ROLE_OWNER_DEFINITON_ID}')]" --output json \
      | jq -r --arg principalId "$(az ad signed-in-user show --query objectId -otsv)" '.[] | select(.principalId==$principalId)'//empty)"
    
    printf "Checking if you have required AZ role active..."
    if [[ -z "$testOwner" ]]; then
        echo "You must activate AZ role \"Owner\" in PIM before using this script. Exiting..."
        exit 0
    fi

    printf "Done.\n"
}

function exit_if_user_does_not_have_required_ad_role(){
    # Based on https://docs.microsoft.com/en-us/azure/active-directory/users-groups-roles/roles-view-assignments#view-role-assignments-using-microsoft-graph-api
    # There is no azcli way of doing this, just powershell or rest api, so we will have to query the graph api.
    # The Azure PIM portal use a rest api dedicated to PIM and so can run a more fine grained request, but this is not recommended for third party use.
    local currentUserRoleAssignment

    printf "Checking if you have required AZ AD role active..."
    currentUserRoleAssignment="$(curl -s -X GET --header "Authorization: Bearer $(az account get-access-token --resource https://graph.windows.net/ | jq -r .accessToken)" -H 'Content-Type: application/json' -H 'Cache-Control: no-cache' 'https://graph.windows.net/myorganization/roleAssignments?$filter=roleDefinitionId%20eq%20%27cf1c38e5-3621-4004-a7cb-879624dced7c%27%20and%20resourceScopes/any(x:x%20eq%20%27/%27)&$expand=principal&api-version=1.61-internal' \
        | jq -r --arg principalId "$(az ad signed-in-user show --query objectId -otsv)" '.value[] | select(.roleDefinitionId=="cf1c38e5-3621-4004-a7cb-879624dced7c" and .principalId==$principalId)'//empty)"

    if [[ -z "$currentUserRoleAssignment" ]]; then
        echo "You must activate AZ AD role \"Application Developer\" in PIM before using this script. Exiting..."
        exit 0
    fi

    printf "Done.\n"
}