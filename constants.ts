import { Product, Order } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    brand: "Adidas",
    name: "Real Madrid Home 24/25",
    price: 349.90,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKdajp0aKoAyK8Kj0asB5avne0fth7trGNeFgi8ECpm6Cd5gFyKvwhcQIKxAmWFeoeP7HVSzfL2IWHb9Xoirs57N_Vf5RVH8Jft_Yu2oFsIek_gwFrwLdNg7jboxl1bsn7cGjHWBZUoqMfqsx14x5cMkx3aUe7U2ECNOmhd8GtdiTrlAiAay2GcNpeX0jUCggviR9cNM4tUOcUb9fHdlnCTtr-QoN7c_9Tb42uMajGdLSwrDcgAk--kGTG6Y9v96xfiMt2dIqdKA",
    category: "Clubes",
    subcategory: "Internacional",
    isNew: true,
    images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAKdajp0aKoAyK8Kj0asB5avne0fth7trGNeFgi8ECpm6Cd5gFyKvwhcQIKxAmWFeoeP7HVSzfL2IWHb9Xoirs57N_Vf5RVH8Jft_Yu2oFsIek_gwFrwLdNg7jboxl1bsn7cGjHWBZUoqMfqsx14x5cMkx3aUe7U2ECNOmhd8GtdiTrlAiAay2GcNpeX0jUCggviR9cNM4tUOcUb9fHdlnCTtr-QoN7c_9Tb42uMajGdLSwrDcgAk--kGTG6Y9v96xfiMt2dIqdKA",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfW-vlllWsAdPCtBwUgEo8-y7XrJIGcsrxFs9uvDz7YKVytgT5dwIcg3xGrLJ7sdd7D-iNZl-ioMpwOFIGWILltw8WEAJ_Z3Wj81ouzP9f3rkoqpTSKh6Pqizh6pBDxKV8shBJYJ10D_v2bcedmW5VxS1T5DUaxTe1YBG7hEHMScQPAULsnFZXh0UtKoe9ZNsuDtTSQgCGgOqb8V3S46Ckm8wE_Z1sOrUo-DiYab4fE9nA7Wpc2d4ExuRatY3Q5yS22Xd4UC-DZg",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAgagiebZvvsGuHlqepd9ruT65eMDJ9XF4kmA-lnh918KdQialkpfRASrft_7Nm0-lLSggnnOii_LSh4oHU9Cmv-5nOW1-n5nw5PsFV5hrfH1uul59FUr8uHJvoOCn0RCZi0t4tKE-DmiL61z7PoQhoAruzu1rizh04E05eTyg3jT7mrZRmVX1Bs9TyjNdI1snPV-IMfVBgvNt8STfUGG8SkGKLOgLZq-va1QxYVAgNBUnURX5uDu3DHyMkbr0_R1Qd04CMMihf8w"
    ]
  },
  {
    id: 2,
    brand: "Nike",
    name: "Brasil Oficial Home 24",
    price: 399.90,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB89JF7dVN1U8OQQWvZ4PFyoC5FJcc_Nrv-9MUpH_K-oAluhMGbTx3kV-DVN8ul5BbizYqm_N3AaF5ZKZLSQlRCQy13p47jCSx91Lshr_4KN3BQAcJTiBgCLBzXk9TFAoRPcz7ksOrgNOzojeQWQfgUlbK2YqBx5RpMKjKN4o8r4p4Nwjoo6ZDLbaXCDOasTVz5AxhKQn1TrwHkS2mMRPTKIAymXALsIjxWCvkwJa_6ee43gipf3ClczNkSHCqtwnEbBffFlJUn8Q",
    category: "Seleções",
    subcategory: "Seleções",
    isNew: true
  },
  {
    id: 3,
    brand: "Puma",
    name: "Man City Away 24/25",
    price: 349.90,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVDsHQkpAsHWTJ74bxj0gOX-EcJI13FKgvpbDSdBkr4_fVwiJHh3hOvYQmUjNrKEPnCWaH3yN_RjyaEHcuVyJQ0VzKuNzyVzp4KVPJJE84MhjDntKgyKqgudC6onuk4OlCcX1mP-yTEriS275IrSgPXcLuLWbMjzXlPu_fpNkMX8cOXS8u1srdPfo8VCaQvfM2STGlYq2cFoh-JhnA3oChJikJvjxx5H2WGJ0OY8hge6hICfgfCEpT_2OtwP7QCYLGNu1q61ejjQ",
    category: "Clubes",
    subcategory: "Internacional"
  },
  {
    id: 4,
    brand: "Adidas",
    name: "Flamengo Home 24/25",
    price: 349.90,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqhaMlm8fm5m51DDnTUxXHM1cmvSlOdmuWnX4kN6VQ_YHqHs7cuh4F0HaOZlIzqRa1_3ilNdCuiKxPqRZuoxyZQ2ZeaZFNrSQR5IoKBKYGpWsTWHrEXgvLNJJOOWR57ySB4SyCbvyJyC-6PTsNwLRLpE5RrZ4LBdMoNEX9fdEwVPgAvueiJ30wYQpUa2ssbFluwWl9BnxN2mMYcOmipX9DwsTX4BdX8acgbxgRhjqZ-PUqXZUkYvqyPRzLp8ld-6nHpO8aeLrXoA",
    category: "Clubes",
    subcategory: "Nacional"
  },
  {
      id: 5,
      brand: "Nike",
      name: "Liverpool Home 24/25",
      price: 125.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQYX_hZTBGp_3lX36VmvGT0MdPfv_HoMbrnIoU5VhziiPwYSai5lBRjKYa32SHtQ1gZSqa72oqDzlial3l7QDmAqOXAd_GAh-XnH0ZzI1vKd1-qsidRtpqsPQGpGZA0tWiPXbyBE9t14-4Zm-y6DVIQtJoNruHcudKpxGizTdlCh_Hgn6M1QQ-x1lOzIx_Z9eQTVu8GftCz4DUWopikGUVlThZdveTg1cOINJ8AAnP9LU8ug12kV19Xp2ibNiiGm5lXqyiw97Wew",
      category: "Clubes",
      subcategory: "Internacional"
  },
  {
      id: 6,
      brand: "Jordan",
      name: "PSG Third 24/25",
      price: 185.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP2DdXt6SnphgoHxoJPdBg8Ex9BVBzeo6HRhHedL8CQqVgbW-_P6VX_lQ78kwQtAO_XabPg5nhi1xK2qmZSj-yoIylkny2eueWSYAuwmJsY1NNmSBxxtiB27RXxVPM5MIvYUUlWi8xoM7zX3oknm50_62IlfqSufrmCfFjY5aPP6pMvXYEyBhFgisgy3GMY_7zEHtRXdEmeTMZZsPyd8r-jN9IDrXi1Yo_bWI9aIendZIJ9UbHHq7i5_kPmxHugJ4Qsf3T6qVl6Q",
      category: "Clubes",
      subcategory: "Internacional",
      isNew: true
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "#88291",
    date: "12/10/2023",
    status: "Processando",
    total: 399.90,
    items: [
        { ...MOCK_PRODUCTS[1], quantity: 1, size: 'M' }
    ]
  },
  {
    id: "#88150",
    date: "05/09/2023",
    status: "Entregue",
    total: 699.80,
    items: [
        { ...MOCK_PRODUCTS[0], quantity: 1, size: 'G' },
        { ...MOCK_PRODUCTS[2], quantity: 1, size: 'M' }
    ]
  }
];