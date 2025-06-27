import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { SubPageData } from "./types";
import Countdown from "../../components/Countdown";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export enum AuctionStatus {
  auction_preview = "auctions-preview",
  auction_live = "auctions-active",
  auction_ended = "auctions-ended",
  auction_cancelled = "auctions-cancelled",
  auctions_awarded = "auctions-awarded",
}

interface Props {
  item: SubPageData;
  routeKey: string;
  onReject: () => void;
  onAccept: () => void;
  onHandover: () => void;
  onPayment: () => void;
  onCountdownComplete?: () => void;
}

const SellItemCard: React.FC<Props> = ({
  item,
  routeKey,
  onReject,
  onAccept,
  onHandover,
  onPayment,
  onCountdownComplete,
}) => {
  const showHandover = item.has_handover_appointment === false;
  const showPayment = item.has_payment_detail === false;
  const isPendingAcceptance =
    item.status?.name === "lead-sell-form-pending-acceptance" ||
    item.status?.name === "lead-sell-form-counter-offer-pending-acceptance";

  const getAuctionLabelsAndValues = (auction?: {
    status_name?: string;
    bid_count?: number;
    start_price?: string;
    current_amount?: string;
    highest_amount?: string;
    time_start?: string;
    time_end?: string;
    extended_time_end?: string;
  }): {
    bidLabel: string;
    bidValue: string;
    timeLabel: string;
    timeValue: string;
  } => {
    const status = auction?.status_name;
    const bidCount = auction?.bid_count ?? 0;
    const useStartPrice = bidCount === 0;

    switch (status) {
      case AuctionStatus.auction_preview:
        return {
          bidLabel: "Starting Bid:",
          bidValue: auction?.start_price ?? "-",
          timeLabel: "Time Starts:",
          timeValue: auction?.time_start ?? "-",
        };

      case AuctionStatus.auction_live:
        return {
          bidLabel: useStartPrice ? "Starting Bid:" : "Current Bid:",
          bidValue: useStartPrice
            ? auction?.start_price ?? "-"
            : auction?.current_amount ?? "-",
          timeLabel: "Time Left:",
          timeValue: auction?.extended_time_end ?? "-", // 倒计时可以由 UI 决定如何显示
        };

      case AuctionStatus.auction_ended:
        return {
          bidLabel: useStartPrice ? "Starting Bid:" : "Highest Bid:",
          bidValue: useStartPrice
            ? auction?.start_price ?? "-"
            : auction?.highest_amount ?? "-",
          timeLabel: "Time Ended:",
          timeValue: auction?.time_end ?? "-",
        };

      case AuctionStatus.auction_cancelled:
        return {
          bidLabel: "Starting Bid:",
          bidValue: auction?.start_price ?? "-",
          timeLabel: "Time Ended:",
          timeValue: auction?.time_end ?? "-",
        };

      case AuctionStatus.auctions_awarded:
      default:
        return {
          bidLabel: useStartPrice ? "Starting Bid:" : "Highest Bid:",
          bidValue: useStartPrice
            ? auction?.start_price ?? "-"
            : auction?.highest_amount ?? "-",
          timeLabel: "Time Ended:",
          timeValue: auction?.time_end ?? "-",
        };
    }
  };

  const getStatusStylesAndText = (status?: string) => {
    switch (status) {
      case AuctionStatus.auction_live:
        return {
          borderColor: "#38AF00",
          backgroundColor: "#EFFBE9",
          textColor: "#38AF00",
          usedText: "Biddings Live",
        };
      case AuctionStatus.auction_cancelled:
        return {
          borderColor: "#DE1C22",
          backgroundColor: "#FCE9E9",
          textColor: "#DE1C22",
          usedText: "Biddings Cancelled",
        };
      case AuctionStatus.auction_preview:
        return {
          borderColor: "#FF7A00",
          backgroundColor: "#FFF5E5",
          textColor: "#FF7A00",
          usedText: "Biddings Preview",
        };
      case AuctionStatus.auctions_awarded:
        return {
          borderColor: "#FF7A00",
          backgroundColor: "#FFF5E5",
          textColor: "#FF7A00",
          usedText: "Biddings Awarded",
        };
      case AuctionStatus.auction_ended:
      default:
        return {
          borderColor: "#FF7A00",
          backgroundColor: "#FFF5E5",
          textColor: "#FF7A00",
          usedText: "Biddings Ended",
        };
    }
  };

  const { bidLabel, bidValue, timeLabel, timeValue } =
    getAuctionLabelsAndValues(item.auction);

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.car_plate}</Text>
      <Text style={styles.itemTitle}>
        {`${item.manufacture_year} ${item.car_make} ${item.car_model}`}
      </Text>

      {routeKey === "biddings" && item.auction?.status_name
        ? (() => {
            const { borderColor, backgroundColor, textColor, usedText } =
              getStatusStylesAndText(item.auction.status_name);

            return (
              <View
                style={[styles.statusBadge, { borderColor, backgroundColor }]}
              >
                <Text style={[styles.statusText, { color: textColor }]}>
                  {usedText}
                </Text>
              </View>
            );
          })()
        : item.status_display_name &&
          item.tip?.text_color && (
            <View
              style={[styles.statusBadge, { borderColor: item.tip.text_color }]}
            >
              <Text style={[styles.statusText, { color: item.tip.text_color }]}>
                {item.status_display_name}
              </Text>
            </View>
          )}

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>
          {routeKey === "biddings" ? bidLabel : "Location:"}
        </Text>
        <Text style={styles.infoValue}>
          {routeKey === "biddings" ? formatCurrency(bidValue) : item.location}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>
          {routeKey === "biddings" ? timeLabel : "Date:"}
        </Text>
        {routeKey === "biddings" &&
        item.auction?.status_name === AuctionStatus.auction_live ? (
          <Countdown
            targetTime={timeValue}
            style={styles.infoValue}
            dangerColor="#FF3B30" // 可选，自定义红色
            onComplete={onCountdownComplete}
          />
        ) : (
          <Text style={styles.infoValue}>
            {routeKey === "biddings" ? formatDate(timeValue) : item.date_value}
          </Text>
        )}
      </View>

      {routeKey === "biddings" && (
        <View style={styles.bidInfoContainer}>
          <View style={styles.bidInfoBox}>
            <Text style={styles.bidInfoLabel}>
              {item.auction.bid_count ?? 0}
            </Text>
            <Text style={styles.bidInfoText}>Bids</Text>
          </View>
          <Text style={styles.dotSeparator}>•</Text>
          <View style={styles.bidInfoBox}>
            <Text style={styles.bidInfoLabel}>
              {item.auction.bidders_count ?? 0}
            </Text>
            <Text style={styles.bidInfoText}>Bidders</Text>
          </View>
        </View>
      )}

      {item.tip?.description && (
        <View style={styles.statusBox}>
          <Text style={[styles.statusText, { color: item.tip.text_color }]}>
            {item.tip.description}
          </Text>
        </View>
      )}

      {isPendingAcceptance ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onReject}
          >
            <Text style={styles.buttonText}>Not Interested</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      ) : (
        (showHandover || showPayment) && (
          <View style={styles.buttonRow}>
            {showHandover && (
              <TouchableOpacity style={styles.button} onPress={onHandover}>
                <Text style={styles.buttonText}>Handover</Text>
              </TouchableOpacity>
            )}
            {showPayment && (
              <TouchableOpacity style={styles.button} onPress={onPayment}>
                <Text style={styles.buttonText}>Payment</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  infoLabel: {
    width: 100, // 关键：固定 label 宽度
    fontWeight: "500",
    color: "#666",
    fontSize: 14,
  },

  infoValue: {
    flex: 1, // value 部分自动占剩余空间
    color: "#333",
    fontSize: 14,
  },
  statusBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FFF3E8",
    borderRadius: 8,
  },
  statusText: {
    color: "#FF6B00",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: "#FF6B00",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#eee",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 6,
    marginBottom: 10,
  },
  bidInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  bidInfoBox: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 8,
  },
  bidInfoLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  bidInfoText: {
    fontSize: 12,
    color: "#999",
  },
  dotSeparator: {
    color: "#ccc",
    fontSize: 16,
  },
});

export default SellItemCard;
