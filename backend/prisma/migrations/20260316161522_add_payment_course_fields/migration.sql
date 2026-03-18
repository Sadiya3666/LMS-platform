-- AlterTable
ALTER TABLE `subject` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `difficulty_level` VARCHAR(191) NULL,
    ADD COLUMN `instructor_name` VARCHAR(191) NULL,
    ADD COLUMN `is_free` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `price` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `rating` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `thumbnail_url` VARCHAR(191) NULL,
    ADD COLUMN `total_duration_seconds` INTEGER NULL,
    ADD COLUMN `total_students` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `video` ADD COLUMN `thumbnail_url` VARCHAR(191) NULL,
    ADD COLUMN `youtube_video_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Payment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `payment_method` VARCHAR(191) NOT NULL DEFAULT 'dummy',
    `transaction_id` VARCHAR(191) NULL,
    `paid_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Payment_transaction_id_key`(`transaction_id`),
    UNIQUE INDEX `Payment_user_id_subject_id_key`(`user_id`, `subject_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
