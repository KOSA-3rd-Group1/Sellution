-- Company 데이터
INSERT INTO company (display_name, name, shop_url, is_shop_visible, is_auto_approved, is_new_member_event, service_type, subscription_type, min_delivery_count, max_delivery_count, theme_color, main_promotion1_title, main_promotion1_content, main_promotion2_title, main_promotion2_content, sell_type)
VALUES
    ('프레시팜', 'FreshFarm', 'http://freshfarm.com', 'Y', 'Y', 'Y',  'SUBSCRIPTION','MONTH', 5, 30, 'F37021', '신선한 농산물', '매일 아침 배송되는 신선한 채소와 과일', '정기배송 할인', '정기배송 신청 시 10% 할인', 'ALL'),
('퀵밀', 'QuickMeal', 'http://quickmeal.com', 'Y', 'N', 'N', 'SUBSCRIPTION','MONTH', 1, 1, 'E34F26', '빠른 한끼', '15분 만에 완성되는 맛있는 식사', '첫 주문 할인', '첫 주문 시 2,000원 할인', 'ALL'),
('오가닉박스', 'OrganicBox', 'http://organicbox.com', 'Y', 'Y', 'Y', 'SUBSCRIPTION','MONTH', 4, 24, '4CAF50', '유기농 식품', '엄선된 유기농 식품 정기배송', '첫 구독 할인', '첫 구독 시 20% 할인', 'ALL');

-- Customer 데이터
INSERT INTO customer (company_id, username, password, name, phone_number, is_sms_agreement, type, created_at, updated_at)
VALUES
    (1, 'user1', 'password123', '김철수', '01012345678', 'Y', 'NEW', NOW(), NOW()),
    (1, 'user2', 'password456', '이영희', '01087654321', 'Y', 'NORMAL', NOW(), NOW()),
    (2, 'user3', 'password789', '박지민', '01011112222', 'N', 'NEW', NOW(), NOW()),
    (3, 'user4', 'password321', '정수연', '01033334444', 'Y', 'NORMAL', NOW(), NOW()),
    (1, 'user5', 'password654', '최재우', '01055556666', 'Y', 'NEW', NOW(), NOW()),
    (2, 'user6', 'password987', '강민서', '01077778888', 'N', 'NORMAL', NOW(), NOW()),
    (3, 'user7', 'passwordabc', '윤서연', '01099990000', 'Y', 'NORMAL', NOW(), NOW());

-- Address 데이터
INSERT INTO address (customer_id, address, name, zipcode, address_detail, phone_number, is_default_address, address_name, created_at)
VALUES
    (1, '서울시 강남구', '김철수', '06001', '아파트 101동 1001호', '01012345678', 'Y', '집', NOW()),
(2, '서울시 서초구', '이영희', '06501', '빌라 201호', '01087654321', 'Y', '집', NOW()),
(3, '서울시 송파구', '박지민', '05501', '오피스텔 305호', '01011112222', 'Y', '집', NOW()),
(4, '경기도 성남시', '정수연', '13501', '아파트 502동 801호', '01033334444', 'Y', '집', NOW()),
(5, '인천시 연수구', '최재우', '21901', '빌라 103호', '01055556666', 'Y', '집', NOW()),
(6, '부산시 해운대구', '강민서', '48101', '아파트 1205동 2001호', '01077778888', 'Y', '집', NOW()),
(7, '대구시 수성구', '윤서연', '42153', '주택 2층', '01099990000', 'Y', '집', NOW()),
(1, '서울시 강남구', '김철수 회사', '06002', '회사 빌딩 8층', '01012345678', 'N', '회사', NOW()),
(4, '경기도 성남시', '정수연 회사', '13502', '회사 빌딩 12층', '01033334444', 'N', '회사', NOW());

-- Category 데이터
INSERT INTO category (name, is_visible)
VALUES
    ('신선 식품', 'Y'),
    ('가공 식품', 'Y'),
    ('유기농 식품', 'Y');

-- Product 데이터 수정 (category_id 추가)
INSERT INTO product (company_id, code, name, stock, cost, product_information, is_visible, delivery_type, category_id, created_at, updated_at)
VALUES
    (1, 20240101000001, '신선 채소 박스', 100, 15000, '각종 신선한 채소 모음', 'Y', 'BOTH', 1, NOW(), NOW()),
    (1, 20240101000002, '제철 과일 세트', 50, 25000, '제철 과일 모음', 'Y', 'BOTH', 1, NOW(), NOW()),
    (2, 20240101000003, '즉석 파스타', 200, 8000, '15분 만에 완성되는 파스타', 'N', 'BOTH', 2, NOW(), NOW()),
    (2, 20240101000004, '샐러드 도시락', 150, 6000, '신선한 채소로 만든 샐러드', 'N', 'BOTH', 2, NOW(), NOW()),
    (2, 20240101000005, '유기농 채소 박스', 80, 20000, '인증 받은 유기농 채소 모음', 'Y', 'BOTH', 3, NOW(), NOW()),
    (2, 20240101000006, '유기농 과일 세트', 60, 30000, '제철 유기농 과일 모음', 'Y', 'BOTH', 3, NOW(), NOW()),
    (1, 20240101000007, '달걀 20구', 200, 5000, '신선한 유정란', 'Y', 'BOTH', 1, NOW(), NOW()),
    (3, 20240101000008, '즉석 볶음밥', 180, 7000, '10분 만에 완성되는 볶음밥', 'Y', 'BOTH', 2, NOW(), NOW());
-- Product 데이터
# INSERT INTO product (company_id, code, name, stock, cost, product_information, is_visible, delivery_type, created_at, updated_at)
# VALUES
#     (1, 20240101000001, '신선 채소 박스', 100, 15000, '각종 신선한 채소 모음', 'Y', 'BOTH', NOW(), NOW()),
# (1, 20240101000002, '제철 과일 세트', 50, 25000, '제철 과일 모음', 'Y', 'BOTH', NOW(), NOW()),
# (2, 20240101000003, '즉석 파스타', 200, 8000, '15분 만에 완성되는 파스타', 'Y', 'BOTH', NOW(), NOW()),
# (2, 20240101000004, '샐러드 도시락', 150, 6000, '신선한 채소로 만든 샐러드', 'Y', 'BOTH', NOW(), NOW()),
# (3, 20240101000005, '유기농 채소 박스', 80, 20000, '인증 받은 유기농 채소 모음', 'Y', 'BOTH', NOW(), NOW()),
# (3, 20240101000006, '유기농 과일 세트', 60, 30000, '제철 유기농 과일 모음', 'Y', 'BOTH', NOW(), NOW()),
# (1, 20240101000007, '달걀 20구', 200, 5000, '신선한 유정란', 'Y', 'BOTH', NOW(), NOW()),
# (2, 20240101000008, '즉석 볶음밥', 180, 7000, '10분 만에 완성되는 볶음밥', 'Y', 'BOTH', NOW(), NOW());

-- DayOption 데이터
INSERT INTO day_option (company_id, day_value)
VALUES
    (1, 'MON'),
(1, 'WED'),
(1, 'FRI'),
(3, 'TUE'),
(3, 'THU'),
(3, 'FRI');

-- WeekOption 데이터
INSERT INTO week_option (company_id, week_value)
VALUES
    (1, 1),
(1, 2),
(1, 4),
(3, 1),
(3, 2),
(3, 3);

-- MonthOption 데이터
INSERT INTO month_option (company_id, month_value)
VALUES
    (1, 1),
(1, 3),
(1, 6),
(3, 1),
(3, 2),
(3, 3);


INSERT INTO account( customer_id, bank_code, account_number,created_at)
VALUE(1,'004','42750204039102','2024-07-17');


-- Order 데이터
INSERT INTO orders (account_id,company_id, customer_id, address_id, month_option_id, week_option_id, code, type, status, delivery_status, total_price, delivery_start_date, delivery_end_date, total_delivery_count, remaining_delivery_count, created_at, updated_at)
VALUES
    (1,1, 1, 1, 1, 1, 20240101000001, 'MONTH_SUBSCRIPTION', 'APPROVED', 'BEFORE_DELIVERY', 60000, '2024-01-15', '2024-02-15', 4, 4, NOW(), NOW()),
(1,1, 2, 2, NULL, 2, 20240101000002, 'COUNT_SUBSCRIPTION', 'APPROVED', 'IN_PROGRESS', 100000, '2024-01-10', '2024-03-10', 8, 7, NOW(), NOW()),
(1,2, 3, 3, NULL, NULL, 20240101000003, 'ONETIME', 'APPROVED', 'COMPLETE', 16000, '2024-01-05', '2024-01-05', 1, 0, NOW(), NOW()),
(1,3, 4, 4, 2, 3, 20240101000004, 'MONTH_SUBSCRIPTION', 'APPROVED', 'BEFORE_DELIVERY', 120000, '2024-02-01', '2024-04-01', 8, 8, NOW(), NOW()),
(1,1, 5, 5, NULL, 1, 20240101000005, 'COUNT_SUBSCRIPTION', 'HOLD', 'BEFORE_DELIVERY', 75000, '2024-01-20', '2024-03-20', 6, 6, NOW(), NOW()),
(1,2, 6, 6, NULL, NULL, 20240101000006, 'ONETIME', 'CANCEL', 'BEFORE_DELIVERY', 14000, '2024-01-18', '2024-01-18', 1, 1, NOW(), NOW()),
(1,3, 7, 7, 3, 2, 20240101000007, 'MONTH_SUBSCRIPTION', 'APPROVED', 'IN_PROGRESS', 180000, '2024-01-05', '2024-07-05', 24, 22, NOW(), NOW()),
(1,1, 1, 8, NULL, 3, 20240101000008, 'COUNT_SUBSCRIPTION', 'APPROVED', 'BEFORE_DELIVERY', 50000, '2024-02-01', '2024-04-01', 10, 10, NOW(), NOW()),
(1,2, 3, 3, NULL, NULL, 20240101000009, 'ONETIME', 'APPROVED', 'IN_PROGRESS', 24000, '2024-01-22', '2024-01-22', 1, 0, NOW(), NOW()),
(1,3, 4, 9, 1, 1, 20240101000010, 'MONTH_SUBSCRIPTION', 'HOLD', 'BEFORE_DELIVERY', 90000, '2024-02-05', '2024-03-05', 4, 4, NOW(), NOW());

-- OrderedProduct 데이터
INSERT INTO ordered_product (product_id, order_id, count, discount_rate, price)
VALUES
    (1, 1, 2, 0, 30000),
(2, 1, 1, 10, 22500),
(1, 2, 4, 0, 60000),
(2, 2, 2, 5, 47500),
(3, 3, 2, 0, 16000),
(5, 4, 3, 0, 60000),
(6, 4, 2, 0, 60000),
(1, 5, 3, 0, 45000),
(7, 5, 2, 0, 10000),
(3, 6, 1, 0, 8000),
(4, 6, 1, 0, 6000),
(5, 7, 4, 5, 76000),
(6, 7, 3, 5, 85500),
(1, 8, 2, 0, 30000),
(7, 8, 4, 0, 20000),
(3, 9, 2, 0, 16000),
(4, 9, 1, 0, 6000),
(5, 10, 3, 0, 60000),
(6, 10, 1, 0, 30000);

-- SelectedDay 데이터
INSERT INTO selected_day (order_id, day_option_id)
VALUES
    (1, 1),  -- 첫 번째 주문의 월요일 선택
(1, 3),  -- 첫 번째 주문의 금요일 선택
(2, 2),  -- 두 번째 주문의 수요일 선택
(4, 4),  -- 네 번째 주문의 화요일 선택
(4, 6),  -- 네 번째 주문의 토요일 선택
(5, 1),  -- 다섯 번째 주문의 월요일 선택
(7, 4),  -- 일곱 번째 주문의 화요일 선택
(7, 5),  -- 일곱 번째 주문의 목요일 선택
(8, 1),  -- 여덟 번째 주문의 월요일 선택
(8, 2),  -- 여덟 번째 주문의 수요일 선택
(8, 3),  -- 여덟 번째 주문의 금요일 선택
(10, 4); -- 열 번째 주문의 화요일 선택

-- 주의: ONETIME 주문(3, 6, 9번)은 selected_day에 데이터가 없습니다.

-- CouponEvent 데이터
INSERT INTO coupon_event (company_id, coupon_name, coupon_discount_rate, target_customer_type, event_start_date, event_end_date, state, is_deleted)
VALUES
    (1, '신규 회원 10% 할인 이벤트', 10, 'NEW', '2024-07-20', '2024-07-30', 'UPCOMING', false),
    (1, '일반 회원 15% 할인 이벤트', 15, 'NORMAL', '2024-08-01', '2024-08-15', 'UPCOMING', false),
    (1, '휴면 회원 20% 할인 이벤트', 20, 'DORMANT', '2024-08-05', '2024-08-20', 'UPCOMING', false),
    (1, '신규 회원 5% 할인 이벤트', 5, 'NEW', '2024-09-01', '2024-09-10', 'UPCOMING', false),
    (1, '일반 회원 25% 할인 이벤트', 25, 'NORMAL', '2024-07-25', '2024-08-05', 'UPCOMING', false),
    (1, '전 회원 30% 할인 이벤트', 30, 'ALL', '2024-07-20', '2024-08-20', 'UPCOMING', false),
    (3, '전 회원 12% 할인 이벤트', 12, 'ALL', '2024-08-15', '2024-08-25', 'UPCOMING', false),
    (1, '전 회원 18% 할인 이벤트', 18, 'ALL', '2024-07-30', '2024-08-15', 'UPCOMING', false);

-- CouponBox 데이터
INSERT INTO coupon_box (event_id, customer_id, is_used)
VALUES
    -- 신규 회원 10% 할인 이벤트 (타겟: NEW)
    (1, 1, 'N'), -- 김철수 (NEW)
    (1, 5, 'N'), -- 최재우 (NEW)
    (1, 3, 'N'), -- 박지민 (NEW)

    -- 일반 회원 15% 할인 이벤트 (타겟: NORMAL)
    (2, 2, 'N'), -- 이영희 (NORMAL)
    (2, 4, 'N'), -- 정수연 (NORMAL)
    (2, 6, 'N'), -- 강민서 (NORMAL)
    (2, 7, 'N'), -- 윤서연 (NORMAL),

    -- 휴면 회원 20% 할인 이벤트 (타겟: DORMANT) - 현재 휴면 회원이 없으므로 생략

    -- 신규 회원 5% 할인 이벤트 (타겟: NEW)
    (4, 1, 'N'), -- 김철수 (NEW)
    (4, 5, 'N'), -- 최재우 (NEW)
    (4, 3, 'N'), -- 박지민 (NEW)

    -- 일반 회원 25% 할인 이벤트 (타겟: NORMAL)
    (5, 2, 'N'), -- 이영희 (NORMAL)
    (5, 4, 'N'), -- 정수연 (NORMAL)
    (5, 6, 'N'), -- 강민서 (NORMAL)
    (5, 7, 'N'), -- 윤서연 (NORMAL),

    -- 전 회원 30% 할인 이벤트 (타겟: ALL)
    (6, 1, 'N'), -- 김철수 (NEW)
    (6, 2, 'N'), -- 이영희 (NORMAL)
    (6, 3, 'N'), -- 박지민 (NEW)
    (6, 4, 'N'), -- 정수연 (NORMAL)
    (6, 5, 'N'), -- 최재우 (NEW)
    (6, 6, 'N'), -- 강민서 (NORMAL)
    (6, 7, 'N'), -- 윤서연 (NORMAL),

    -- 전 회원 12% 할인 이벤트 (타겟: ALL)
    (7, 1, 'N'), -- 김철수 (NEW)
    (7, 2, 'N'), -- 이영희 (NORMAL)
    (7, 3, 'N'), -- 박지민 (NEW)
    (7, 4, 'N'), -- 정수연 (NORMAL)
    (7, 5, 'N'), -- 최재우 (NEW)
    (7, 6, 'N'), -- 강민서 (NORMAL)
    (7, 7, 'N'), -- 윤서연 (NORMAL),

    -- 전 회원 18% 할인 이벤트 (타겟: ALL)
    (8, 1, 'N'), -- 김철수 (NEW)
    (8, 2, 'N'), -- 이영희 (NORMAL)
    (8, 3, 'N'), -- 박지민 (NEW)
    (8, 4, 'N'), -- 정수연 (NORMAL)
    (8, 5, 'N'), -- 최재우 (NEW)
    (8, 6, 'N'), -- 강민서 (NORMAL)
    (8, 7, 'N'); -- 윤서연 (NORMAL)

