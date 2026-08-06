-- Constraint for student transactions amount signal

ALTER TABLE `student_transactions`
    ADD CONSTRAINT `chk_student_transaction_amount`
        CHECK (
            (`type` = 'CHARGE' AND `amount` < 0) OR
            (`type` = 'PAYMENT' AND `amount` > 0) OR
            (`type` = 'ADJUSTMENT')
            );