package config

import (
	"os"
	"testing"
)

func TestConfigLoadDefaults(t *testing.T) {
	// Clear relevant env vars
	os.Unsetenv("PORT")
	os.Unsetenv("ENV")
	os.Unsetenv("REDIS_URL")

	cfg := Load()

	if cfg.Port != "8080" {
		t.Errorf("Expected default Port 8080, got %s", cfg.Port)
	}
	if cfg.Environment != "development" {
		t.Errorf("Expected default Environment development, got %s", cfg.Environment)
	}
	if cfg.RedisURL != "localhost:6379" {
		t.Errorf("Expected default RedisURL localhost:6379, got %s", cfg.RedisURL)
	}
	if cfg.S3BucketName != "bimanyaya-docs" {
		t.Errorf("Expected default S3BucketName bimanyaya-docs, got %s", cfg.S3BucketName)
	}
}

func TestConfigLoadCustomEnv(t *testing.T) {
	os.Setenv("PORT", "9090")
	os.Setenv("ENV", "production")
	os.Setenv("S3_BUCKET_NAME", "custom-bucket")
	defer func() {
		os.Unsetenv("PORT")
		os.Unsetenv("ENV")
		os.Unsetenv("S3_BUCKET_NAME")
	}()

	cfg := Load()

	if cfg.Port != "9090" {
		t.Errorf("Expected custom Port 9090, got %s", cfg.Port)
	}
	if cfg.Environment != "production" {
		t.Errorf("Expected custom Environment production, got %s", cfg.Environment)
	}
	if cfg.S3BucketName != "custom-bucket" {
		t.Errorf("Expected custom S3BucketName custom-bucket, got %s", cfg.S3BucketName)
	}
}
