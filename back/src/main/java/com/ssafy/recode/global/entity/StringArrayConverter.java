package com.ssafy.recode.global.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StringArrayConverter implements AttributeConverter<String[], String> {

    @Override
    public String convertToDatabaseColumn(String[] attribute) {
        return (attribute != null && attribute.length > 0) ? String.join(",", attribute) : "";
    }

    @Override
    public String[] convertToEntityAttribute(String dbData) {
        return (dbData != null && !dbData.isEmpty()) ? dbData.split(",") : new String[0];
    }
}
