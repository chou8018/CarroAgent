import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import type { SubPageData } from "../SellScreen/types"; // 根据实际路径调整

interface RejectOfferModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (targetPrice: string, remarks: string) => void;
  currentOffer: SubPageData | null;
}

const RejectOfferModal: React.FC<RejectOfferModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  currentOffer,
}) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const maxRemarksLength = 90;

  const handleConfirm = () => {
    onConfirm(targetPrice, remarks);
    setTargetPrice("");
    setRemarks("");
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Reject Offer?</Text>
          <Text style={styles.subtitle}>
            You will lose your offer price of{" "}
            {currentOffer?.price_value || "N/A"}. Are you sure?
          </Text>

          {currentOffer && (
            <View style={styles.carInfoContainer}>
              <Text style={styles.carInfoText}>
                {currentOffer.manufacture_year} {currentOffer.car_make}{" "}
                {currentOffer.car_model}
              </Text>
              <Text style={styles.carInfoText}>
                Plate: {currentOffer.car_plate}
              </Text>
            </View>
          )}

          <Text style={styles.label}>Tell us your target price*</Text>
          <TextInput
            style={styles.priceInput}
            keyboardType="numeric"
            placeholder={
              currentOffer?.target_price != null
                ? `RM ${currentOffer.target_price}`
                : "RM 0"
            }
            value={targetPrice}
            onChangeText={setTargetPrice}
          />

          <Text style={styles.label}>Remarks (optional)</Text>
          <TextInput
            style={styles.remarksInput}
            multiline
            placeholder="Enter your reason for rejecting this offer..."
            maxLength={maxRemarksLength}
            value={remarks}
            onChangeText={setRemarks}
          />
          <Text style={styles.characterCount}>
            {maxRemarksLength - remarks.length} Characters Left
          </Text>

          {currentOffer?.date_value && (
            <View style={styles.traceContainer}>
              <Text style={styles.traceText}>
                Offer Date: {currentOffer.date_value}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !targetPrice && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={!targetPrice}
            >
              <Text style={styles.confirmButtonText}>Confirm Rejection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  carInfoContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  carInfoText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 4,
    fontSize: 14,
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  traceContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginBottom: 20,
  },
  traceText: {
    fontSize: 12,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 14,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#e74c3c80",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RejectOfferModal;
