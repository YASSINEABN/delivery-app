package com.deliveryapp.deliverer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.sqlite.SQLiteConfig;
import org.sqlite.SQLiteDataSource;

import javax.sql.DataSource;

/**
 * Configures the SQLite DataSource so that DATE columns stored as "yyyy-MM-dd"
 * are parsed correctly. The default SQLite JDBC behaviour expects
 * "yyyy-MM-dd HH:mm:ss.SSS", which causes "Error parsing date" when reading
 * date-only values.
 */
@Configuration
public class SqliteDataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(@Value("${spring.datasource.url}") String url) {
        SQLiteConfig config = new SQLiteConfig();
        config.toProperties().setProperty("date_string_format", "yyyy-MM-dd");
        SQLiteDataSource ds = new SQLiteDataSource(config);
        ds.setUrl(url);
        return ds;
    }
}
