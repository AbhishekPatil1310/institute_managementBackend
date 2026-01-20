export const paymentAmountCount=
`
SELECT SUM(amount) AS amount_collected_today,count(*) as transaction_count
FROM payments
WHERE DATE(paid_at) = CURRENT_DATE;
`


