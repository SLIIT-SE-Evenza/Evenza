package com.evenza.promotion.entity;

/**
 * Lifecycle states of a special package promotion.
 */
public enum PromotionStatus {

    // Saved but not published.
    DRAFT,

    // Published, but the campaign start time has not arrived.
    SCHEDULED,

    // Published and currently available to customers.
    ACTIVE,

    // The campaign end time has passed.
    EXPIRED,

    // The vendor has stopped the promotion.
    INACTIVE,

    // Kept for historical reference; editing is disabled.
    ARCHIVED
}