import { Quiz } from "../../../types";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../../utils/supabaseClient";

export default async (req, res) => {
  if (req.method === "POST") {
    const { id } = req.query;

    let { data, error } = await supabase.rpc("increment", {
      x: 1,
      row_id: parseInt(id),
    });

    if (error) console.error(error);

    if (error) {
      res.status(500).json({ error });
    }

    return res.status(200).json({
      total: data[0],
    });
  }

  if (req.method === "GET") {
    let { data, error } = await supabase
      .from<Quiz>("quizzes")
      .select("views")
      .eq("id", req.query.id);

    if (error) {
      res.status(500).json({ error });
    }

    return res.status(200).json({ total: data[0].views });
  }
};
