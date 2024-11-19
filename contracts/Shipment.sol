// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Shipment {
    enum ShipmentStatus { Created, InTransit, Delivered }

    struct ShipmentDetails {
        string origin;
        string destination;
        ShipmentStatus status;
        uint256 timestamp;
    }

    mapping(uint256 => ShipmentDetails) public shipments;
    uint256 public totalShipments;
    uint256 public activeShipments;

    event ShipmentCreated(uint256 indexed shipmentId, string origin, string destination);
    event ShipmentUpdated(uint256 indexed shipmentId, ShipmentStatus status);

    function createShipment(string memory _origin, string memory _destination) public returns (uint256) {
        uint256 shipmentId = totalShipments + 1;
        shipments[shipmentId] = ShipmentDetails({
            origin: _origin,
            destination: _destination,
            status: ShipmentStatus.Created,
            timestamp: block.timestamp
        });
        totalShipments++;
        activeShipments++;
        emit ShipmentCreated(shipmentId, _origin, _destination);
        return shipmentId;
    }

    function updateShipmentStatus(uint256 _shipmentId, ShipmentStatus _status) public {
        require(_shipmentId <= totalShipments, "Invalid shipment ID");
        ShipmentDetails storage shipment = shipments[_shipmentId];
        require(shipment.status != ShipmentStatus.Delivered, "Shipment already delivered");
        
        if (_status == ShipmentStatus.Delivered) {
            activeShipments--;
        }
        
        shipment.status = _status;
        shipment.timestamp = block.timestamp;
        emit ShipmentUpdated(_shipmentId, _status);
    }

    function getShipment(uint256 _shipmentId) public view returns (ShipmentDetails memory) {
        require(_shipmentId <= totalShipments, "Invalid shipment ID");
        return shipments[_shipmentId];
    }

    function getTotalShipments() public view returns (uint256) {
        return totalShipments;
    }

    function getActiveShipments() public view returns (uint256) {
        return activeShipments;
    }
}
