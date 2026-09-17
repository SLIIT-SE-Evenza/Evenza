package com.evenza.promotion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

/**
 * Time configuration for the promotion module.
 */
@Configuration
public class PromotionConfiguration {

    /**
     * Supplies the current time for campaign availability checks.
     */
    @Bean(name = "promotionClock")
    public Clock promotionClock() {
        return Clock.systemUTC();
    }

    /**
     * Defines the time zone used to interpret form dates
     * and display campaign times.
     *
     * Defaults to Sri Lanka's time zone.
     */
    @Bean(name = "promotionZone")
    public ZoneId promotionZone(
            @Value("${evenza.promotion.zone:Asia/Colombo}")
            String zone
    ) {
        return ZoneId.of(zone);
    }
}