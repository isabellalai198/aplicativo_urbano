import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Category = "iluminacao" | "buraco" | "dengue";
export type Status = "pendente" | "em_andamento" | "resolvido";
export type Priority = "baixa" | "media" | "alta";

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  priority: Priority;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface ProblemsContextType {
  problems: Problem[];
  loading: boolean;
  addProblem: (data: Omit<Problem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProblem: (id: string, data: Partial<Omit<Problem, "id" | "createdAt">>) => Promise<void>;
  deleteProblem: (id: string) => Promise<void>;
  getProblemById: (id: string) => Problem | undefined;
}

const ProblemsContext = createContext<ProblemsContextType | null>(null);

const STORAGE_KEY = "@cidade_alerta_problems";

const SEED_DATA: Problem[] = [
  {
    id: "seed1",
    title: "Poste apagado na Rua das Flores",
    description: "Poste sem iluminação há 3 dias, trecho perigoso à noite.",
    category: "iluminacao",
    status: "pendente",
    priority: "alta",
    address: "Rua das Flores, 120 - Centro",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "seed2",
    title: "Buraco na Av. Brasil",
    description: "Grande buraco na pista, já danificou carros.",
    category: "buraco",
    status: "em_andamento",
    priority: "alta",
    address: "Av. Brasil, 450 - Jardim América",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "seed3",
    title: "Foco de dengue no terreno baldio",
    description: "Terreno baldio com água parada e acúmulo de lixo.",
    category: "dengue",
    status: "pendente",
    priority: "media",
    address: "Rua Ipiranga, 88 - Vila Nova",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export function ProblemsProvider({ children }: { children: React.ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProblems(JSON.parse(stored));
        } else {
          setProblems(SEED_DATA);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
        }
      } catch {
        setProblems(SEED_DATA);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next: Problem[]) => {
    setProblems(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addProblem = useCallback(async (data: Omit<Problem, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newProblem: Problem = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    await persist([newProblem, ...problems]);
  }, [problems]);

  const updateProblem = useCallback(async (id: string, data: Partial<Omit<Problem, "id" | "createdAt">>) => {
    const next = problems.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    await persist(next);
  }, [problems]);

  const deleteProblem = useCallback(async (id: string) => {
    const next = problems.filter((p) => p.id !== id);
    await persist(next);
  }, [problems]);

  const getProblemById = useCallback((id: string) => {
    return problems.find((p) => p.id === id);
  }, [problems]);

  return (
    <ProblemsContext.Provider value={{ problems, loading, addProblem, updateProblem, deleteProblem, getProblemById }}>
      {children}
    </ProblemsContext.Provider>
  );
}

export function useProblems() {
  const ctx = useContext(ProblemsContext);
  if (!ctx) throw new Error("useProblems must be used inside ProblemsProvider");
  return ctx;
}
