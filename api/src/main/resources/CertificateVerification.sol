// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract CertificateVerification {
    struct Certificate {
        string issuer;
        string memo;
        uint256 timestamp;
        bool revoke;
    }

    address private owner;

    constructor() {
        owner = msg.sender;
    }

    mapping(bytes32=>Certificate) private certificates;

    modifier _Owner() {
        require(owner == msg.sender, "Unauthorize Access");
        _;
    }

    function storeCertificate(string memory issuer, string memory memo, bytes32 certHash) external _Owner returns (uint256) {
        require(certificates[certHash].timestamp == 0, "Certificate already exists");
        certificates[certHash] = Certificate(issuer, memo, block.timestamp, false);
        return certificates[certHash].timestamp;
    }

    function revokeCertificate(bytes32 certHash) external _Owner {
        require(certificates[certHash].timestamp != 0, "Certificate does not already exists");
        certificates[certHash].revoke = true;
    } 

    function getCertificate(bytes32 certHash) external view returns (string memory issuer, string memory memo, bool) {
        require(certificates[certHash].timestamp != 0, "Certificate does not already exists");
        Certificate memory cert =  certificates[certHash];
        return (cert.issuer, cert.memo, cert.revoke);
    }

    function verifyCertificate(bytes32 certHash) external view returns (bool) {
        return (certificates[certHash].timestamp != 0 && !certificates[certHash].revoke);
    }
}