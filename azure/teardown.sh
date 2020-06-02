#!/bin/bash


#######################################################################################
### PURPOSE
### 

# Tear down app resources in azure. Yes this is overengieering for a summer project, I have a condition...

#######################################################################################
### HOW TO USE
### 

# AZ_CONFIG=./azure.env ./teardown.sh

#######################################################################################
### START
### 

echo ""
echo "Start teardown of eit-web-ar azure resources... "


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
echo -e "Teardown of EIT Web AR will use the following configuration:"
echo -e ""
echo -e "   > WHERE:"
echo -e "   ------------------------------------------------------------------"
echo -e "   -  AZ_SUBSCRIPTION                     :  $(az account show --query name -otsv)"
echo -e "   -  AZ_INFRASTRUCTURE_REGION            :  ${AZ_INFRASTRUCTURE_REGION}"
echo -e ""
echo -e "   > WHAT:"
echo -e "   -------------------------------------------------------------------"
echo -e "   -  AZ_RESOURCE_GROUP_COMMON            : ${AZ_RESOURCE_GROUP_COMMON}"
echo -e "   -  AZ_RESOURCE_AAD_APP_NAME            : $(az ad app show --id "${AZ_RESOURCE_AAD_APP_ID}" --query 'displayName' -otsv)"
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
az group delete --name "${AZ_RESOURCE_GROUP_COMMON}" --yes --output none
printf "...Done\n\n"

printf "Working on ad app..."
az ad app delete --id "${AZ_RESOURCE_AAD_APP_ID}" --output none
printf "...Done\n\n"




#######################################################################################
### END
###

echo ""
echo "Teardown of eit-web-ar azure resources done!"