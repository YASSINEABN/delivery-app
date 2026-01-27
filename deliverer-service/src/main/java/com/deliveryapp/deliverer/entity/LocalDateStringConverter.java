package com.deliveryapp.deliverer.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Converts LocalDate to/from "yyyy-MM-dd" strings for SQLite DATE columns.
 * Avoids SQLite JDBC's default date parser which expects "yyyy-MM-dd HH:mm:ss.SSS".
 */
@Converter(autoApply = false)
public class LocalDateStringConverter implements AttributeConverter<LocalDate, String> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public String convertToDatabaseColumn(LocalDate attribute) {
        return attribute == null ? null : attribute.format(FORMATTER);
    }

    @Override
    public LocalDate convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        return LocalDate.parse(dbData.trim(), FORMATTER);
    }
}
