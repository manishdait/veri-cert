# VeriCert – Blockchain-based Certificate Verification System

VeriCert is a blockchain-powered certificate verification platform. It allows issuers to create and revoke certificates, users to access their certificates, and anyone to verify them securely via blockchain (Hedera Testnet).


## Feature
- JWT-based **Login & Signup** (Users / Issuers)
    - **Issuers:** Issue & Revoke certificates to user
    - **Users:** Access & Share there certificates
    
- Public **Verification** by ID or QR Code

- **Postgres** for off-chain data storage

- **Smart Contract** for immutable storage and verification (on-chain)

- Smart Contract **Integration** via **Hiero Enterprise Java SDK**


## Project Structure
```
.
├── api/                 # Spring Boot backend
│   ├── src/             
|   |   ├── main/        # Java source code
|   |   └── resources/   # Solidity code
│   ├── target/          # Build artifacts
│   ├── pom.xml          # Maven config
│   ├── .env             # Environment variables 
│   └── ...
│
├── client/              # Angular frontend
│   ├── src/             # Angular components & services
│   ├── public/          # Static assets
│   ├── package.json     # Dependencies
│   └── angular.json
│
├── docker-compose.yml   # Services: PostgreSQL + pgAdmin
├── README.md            # Project documentation

```

## Setup
1. Clone Repo

    ```bash
    git clone https://github.com/manishdait/veri-cert.git
    cd veri-cert
    ```

2. Configure Environment Variables (`api/.env`)

    ```env
    DB_USERNAME=your_db_user
    DB_PASSWORD=your_db_password
    DB_URL=jdbc:postgresql://localhost:5432/veri_cert

    CLIENT_URL=http://localhost:4200

    JWT_SECRET_KEY=your_secret
    JWT_EXPIRATION=3600

    HIERO_ACCOUNT_ID=0.0.xxxx
    HIERO_PRIVATE_KEY=302e...
    HIERO_NETWORK=hedera-testnet

    CONTRACT_ADDRESS=0.0.xxxx

    ```
3. How Deploy Smart Contract:

    - Deploy your certificate smart contract:
        ```js
        client = Client.forTestnet();
        // Set the operator with account ID and private key
        client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
        
        const bytecode = "" // Your compiled smart contract bytecode

        // Create the contract deployment transaction
        const contractCreateFlow = new ContractCreateFlow()
        .setGas(400000)
        .setBytecode(bytecode);
        
        // Execute the deployment
        const txContractCreateFlowResponse = await contractCreateFlow.execute(client);
        
        // Fetch receipt
        const receiptContractCreateFlow = await txContractCreateFlowResponse.getReceipt(client);
        
        // Get new contract ID
        const contractId = receiptContractCreateFlow.contractId;
        
        console.log("✅ Contract deployed successfully");
        console.log("📄 Contract ID:", contractId.toString());
        ```
    
    - Copy the **Contract ID** from the console output.

    - Paste it into your `api/.env` file under:

        ```env
        CONTRACT_ADDRESS=0.0.xxxx
        ```
      
    - Spring Boot backend will now interact with this contract using the **Hiero Enterprise Java**.

4. Start PostgreSQL
    ```bash
    docker-compose up -d
    ```
  
5. Run Backend
    ```bash
    cd api
    ./mvnw spring-boot:run
    ```

6. Run Frontend
    ```bash
    cd client
    bun install
    bun start
    ```


## Example Workflow

1. Issuer logs in → issues certificate

2. Certificate details are stored in **PostgreSQL (relational metadata)**

3. A **unique certificate hash** is generated and recorded on the **Smart contract**

4. User accesses certificate → shares via **QR or ID**

4. Verifier checks certificate → backend queries the **Hedera Testnet** network → **Valid / Revoked / Not Found**

