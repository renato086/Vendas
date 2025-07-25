import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, Trash } from 'lucide-react';
import logo from "@/assets/logo.png";
import { db } from "./firebase.js";
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";

// Opções de feira
const feiraOptions = ["CAF", "NIPO"];

export default function ControleVendasApp() {
  const [feira, setFeira] = useState(feiraOptions[0]);
  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pagamento, setPagamento] = useState('pix');
  const [vendas, setVendas] = useState([]);

  // Carrega todas as vendas e filtra/localiza conforme feira, ordenando por timestamp
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "vendas"), snapshot => {
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = all
        .filter(v => v.feira === feira)
        .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
      setVendas(filtered);
    });
    return () => unsubscribe();
  }, [feira]);

  // Adiciona nova venda com indicação de feira
  async function adicionarVenda() {
    if (!produto || !preco || !quantidade) return;
    await addDoc(collection(db, "vendas"), {
      feira,
      produto,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade, 10),
      pagamento,
      total: parseFloat(preco) * parseInt(quantidade, 10),
      timestamp: serverTimestamp()
    });
    // Reset campos
    setProduto('');
    setPreco('');
    setQuantidade('');
  }

  // Remove venda
  async function removerVenda(id) {
    await deleteDoc(doc(db, "vendas", id));
  }

  // Soma total geral
  const totalGeral = vendas.reduce((sum, v) => sum + (v.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Logo e seleção de feira */}
      <div className="flex flex-col items-center mb-4 space-y-2">
        <img src={logo} alt="Logo Mundo Nerd" className="h-[60px] w-auto max-w-[160px] object-contain" />
        <select
          value={feira}
          onChange={e => setFeira(e.target.value)}
          className="border rounded px-2 py-1 w-full max-w-xs"
        >
          {feiraOptions.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Container branco principal */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">🤑 Controle de Vendas 🚀</h1>

        {/* Formulário de Vendas */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <Input placeholder="Produto" value={produto} onChange={e => setProduto(e.target.value)} className="w-full" />
              <Input placeholder="Preço" type="number" value={preco} onChange={e => setPreco(e.target.value)} className="w-full" />
              <Input placeholder="Quantidade" type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="w-full" />
              <select
                value={pagamento}
                onChange={e => setPagamento(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="pix">Pix</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
              </select>
              <Button onClick={adicionarVenda} className="flex items-center justify-center">
                <Plus className="w-4 h-4 mr-1" />Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Vendas */}
        <Card>
          <CardContent className="p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendas.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.produto}</TableCell>
                    <TableCell>R$ {v.preco.toFixed(2)}</TableCell>
                    <TableCell>{v.quantidade}</TableCell>
                    <TableCell>{v.pagamento}</TableCell>
                    <TableCell className="font-bold">R$ {v.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => removerVenda(v.id)}>
                        <Trash className="w-4 h-4 mx-auto" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {vendas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400">
                      Nenhuma venda registrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="text-right mt-4 font-bold text-lg">
              Total Geral: R$ {totalGeral.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
