#!/bin/bash


#######################################################################################
### PURPOSE
### 

# Bootstrap app resources in azure. Yes this is overengieering for a summer project, I have a condition...

#######################################################################################
### HOW TO USE
### 

# AZ_CONFIG=./azure.env ./bootstrap.sh

#######################################################################################
### START
### 

echo ""
echo "Start bootstrap eit-web-ar azure resources... "


#######################################################################################
### Check for prerequisites binaries
###

printf "Check for neccesary executables for \"$(basename ${BASH_SOURCE[0]})\"... "
hash az 2> /dev/null || { echo -e "\nError: Azure-CLI not found in PATH. Exiting... " >&2;  exit 1; }
hash jq 2> /dev/null  || { echo -e "\nError: jq not found in PATH. Exiting... " >&2;  exit 1; }
printf "Done.\n"


#######################################################################################
### Read inputs and configs
###

# Required inputs

if [[ -z "$" ]]; then
    echo "Please provide AZ_CONFIG" >&2
    exit 1
else
    if [[ ! -f "$AZ_CONFIG" ]]; then
        echo "AZ_CONFIG=$AZ_CONFIG is invalid, the file does not exist." >&2
        exit 1
    fi
    source "$AZ_CONFIG"
fi

# Optional inputs

if [[ -z "$USER_PROMPT" ]]; then
    USER_PROMPT=true
fi


# Load dependencies
LIB_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/lib.sh"
if [[ ! -f "$LIB_PATH" ]]; then
   echo "The dependency LIB_PATH=$LIB_PATH is invalid, the file does not exist." >&2
   exit 1
else
   source "$LIB_PATH"
fi


#######################################################################################
### Prepare az session
###

printf "Logging you in to Azure if not already logged in... "
az account show >/dev/null || az login >/dev/null
az account set --subscription "$AZ_SUBSCRIPTION_ID" >/dev/null
printf "Done.\n"

exit_if_user_does_not_have_required_az_role
exit_if_user_does_not_have_required_ad_role


#######################################################################################
### Verify task at hand
###

echo -e ""
echo -e "Bootstrap of EIT Web AR will use the following configuration:"
echo -e ""
echo -e "   > WHERE:"
echo -e "   ------------------------------------------------------------------"
echo -e "   -  AZ_SUBSCRIPTION                     :  $(az account show --query name -otsv)"
echo -e "   -  AZ_INFRASTRUCTURE_REGION            :  ${AZ_INFRASTRUCTURE_REGION}"
echo -e ""
echo -e "   > WHAT:"
echo -e "   -------------------------------------------------------------------"
echo -e "   -  AZ_RESOURCE_GROUP_COMMON            : ${AZ_RESOURCE_GROUP_COMMON}"
echo -e "   -  AZ_RESOURCE_KEYVAULT                : ${AZ_RESOURCE_KEYVAULT}"
echo -e "   -  AZ_RESOURCE_AAD_APP_NAME            : ${AZ_RESOURCE_AAD_APP_NAME}"
echo -e ""
echo -e "   > WHO:"
echo -e "   -------------------------------------------------------------------"
echo -e "   -  AZ_USER                             : $(az account show --query user.name -o tsv)"
echo -e ""

echo ""

if [[ $USER_PROMPT == true ]]; then
    read -p "Is this correct? (Y/n) " -n 1 -r
    if [[ "$REPLY" =~ (N|n) ]]; then
    echo ""
    echo "Quitting."
    exit 0
    fi
    echo ""
fi

echo ""


#######################################################################################
### Do the deed!
###

printf "Working on resource group..."
az group create --location "${AZ_INFRASTRUCTURE_REGION}" --name "${AZ_RESOURCE_GROUP_COMMON}" --output none
# Tag resource https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources#azure-cli
az group update -n "${AZ_RESOURCE_GROUP_COMMON}" --set tags.'Contact'="${AZ_INFRASTRUCTURE_CONTACT}" --output none
printf "...Done\n\n"

printf "Working on key vault...\n"
az keyvault create --name "${AZ_RESOURCE_KEYVAULT}" --resource-group "${AZ_RESOURCE_GROUP_COMMON}" --output none
printf "...Done\n\n"

printf "Working on ad app..."
az ad app create --display-name "${AZ_RESOURCE_AAD_APP_NAME}" --output none
printf "...Done\n\n"


#######################################################################################
### END
###

echo ""
echo -e "Boostrapping of eit-web-ar azure resources done!"
echo -e "There are few manual steps that you need to handle,"
echo -e ""
echo -e "   > AZ AD APP:  ${AZ_RESOURCE_AAD_APP_NAME}"
echo -e "   ------------------------------------------------------------------"
echo -e "   - Add owners"
echo -e "   - Store credentials in key vault \"${AZ_RESOURCE_KEYVAULT}\", secret \"${AZ_RESOURCE_AAD_APP_VAULT_SECRET}\" as described in https://github.com/equinor/kitchen/blob/master/azure-resources.md"
echo -e "   - Configure sign-in for users"
echo -e "   - Add the ad app id to the .env file"
echo -e ""