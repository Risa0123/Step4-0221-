import React, { useState, useEffect } from 'react';
// 型定義インポート
import { IDtype, Producttype } from '../type';

type OutputAriaProps = {
  productid: IDtype | null;
};

type Response = {
  status: number; // ステータスコードを数値で保持
  message?: Producttype;
};

const OutputAria: React.FC<OutputAriaProps> = ({ productid }) => {

    const [data, setData] = useState<Response | null>(null);
    const [cartItems, setCartItems] = useState<string[]>([]); 

    useEffect(() => {
        const fetchData = async () => {
            if (productid) {
                try {
                    const response = await fetch('http://127.0.0.1:8000/search_product/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code: productid.PRD_ID }),
                    });
                    const result = await response.json();
                    setData({ status: response.status, ...result });
                } catch (error) {
                    console.error('Fetching data failed', error);
                    setData({ status: 500 }); // 例外が発生した場合は、500とみなす
                }
            }
        };
        
        fetchData();
    }, [productid]);

    // 商品をカートに追加する
    const addToCart = () => {
        if (data?.message) {
            const newProductText = `${data.message.NAME} - ${data.message.PRICE}`;
            setCartItems([...cartItems, newProductText]);
            setData(null);
        }
    };

    // 購入処理
    const purchase = () => {
        // 合計金額を計算する
        const totalPrice = cartItems.reduce((acc, curr) => {
            const price = parseFloat(curr.split('-')[1].trim()); // PRICEを抽出し、数値に変換
            return acc + price;
        }, 0);
        // ポップアップで合計金額を表示し、OKを押したら全てのインプット情報をクリアする
        alert(`合計金額は ${totalPrice} 円です。`);
        setCartItems([]);
        setData(null);

        // カートをクリアする
        setCartItems([]);
    };

    // データフェッチングのステータスを表示
    return (
        <div className="border border-gray-300 p-5 mx-auto max-w-md">
            {/* 商品がない場合の条件分岐 */}
            {!data?.message && <div>商品がマスタ未登録です。</div>} 
            <div className="text-left py-2">

                {data?.message && (
                    <>
                        <div>商品名：{data.message.NAME}</div>
                        <div>金額：{data.message.PRICE}</div>
                    </>
                )}
            </div>
            <button
                type="button"
                onClick={addToCart}
                className="block w-full px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring mt-4"
            >
                カートに追加
            </button>

            {/* カート */}
            <div className="mt-4">
                <h2>購入リスト</h2>
                {cartItems.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
                {cartItems.length === 0 && <div>カートに商品がありません。</div>}
            </div>
            {/* カートに追加ボタン */}

            {/* 購入ボタン */}
            <button
                type="button"
                onClick={purchase}
                className="block w-full px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring mt-2"
            >
                購入
            </button>

        </div>
    );
}

export default OutputAria;


