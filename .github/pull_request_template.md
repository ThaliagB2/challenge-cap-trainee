# Overview 

A dialog was created to display the selected items.

We have the approve column, where it will be possible to approve or reject a record. If you select reject, the justification will be mandatory. If you select approve, the justification will disappear.

I am making sure that it will approve and reject all selected items, and if any of them are rejected, the user needs to provide the justification.

- Jira: https://vaees.atlassian.net/jira/software/c/projects/NN/boards/130?assignee=712020%3A29f4f70d-0f74-4d24-9f9c-b1014822e642

## Test Script 

### Follow the step by step to test the functionality

- application link: https://natura--co---cpea-t4-extensions-dev-g9cd5op4-dev-sap-t4362f05bc.cfapps.us10.hana.ondemand.com/app/launchpad.html#scrapping-approval

- Step 1: select some records, notice that the "mass approval" button will become available.
![image](https://github.com/user-attachments/assets/ff09fc8a-01e2-4faf-9079-bac7b6424623)

- Step 2: Trying to save without selecting any option in the approve column
You notice that when selecting the "Approve" option, it is not possible to select a justification, as requested by the customer.
![image](https://github.com/user-attachments/assets/e020d833-6bf3-4e10-9456-048593437e1a)

- Step 3: Trying to save without selecting justification when selecting reject
![image](https://github.com/user-attachments/assets/6c20337b-e760-45c0-a3c8-3ddab10666cc)


- Step 4: By filling everything out correctly, the data is saved.
![image](https://github.com/user-attachments/assets/7190d911-66c5-4b31-8434-61b482115141)

![image](https://github.com/user-attachments/assets/014e76da-7513-4223-9759-f1bc6701a5a8)

Notice that the approved item was marked with an X, and the disapproved item was marked with an X and we have the justification_country and justification_reasonId filled in

## Test Data 

N/A