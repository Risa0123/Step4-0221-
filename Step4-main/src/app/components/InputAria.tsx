import React from 'react';

type InputAreaProps = {
    onProductChange: (value: string) => void;
};

const InputArea: React.FC<InputAreaProps> = ({ onProductChange }) => {
    // フォーム送信の処理をここに記述することもできます
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // フォームのデフォルト送信動作を防ぎます
        // 入力された商品コードを取得するために、event.currentTargetを使用します
        const code = (event.currentTarget.elements.namedItem('code') as HTMLInputElement).value;
        onProductChange(code);
        console.log('Sending code:', code); 
    };

    return (
        <div className="px-5 py-5 mx-auto max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="code" className="block mb-1">商品コード</label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring"
                >
                    商品コード読み込み
                </button>
            </form>
        </div>
    );
}

export default InputArea;
