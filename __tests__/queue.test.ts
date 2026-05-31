import { Mutation, collapse, enqueue, pruneForDeleted } from "../src/sync/queue";

describe("enqueue", () => {
  it("kuyruğun sonuna ekler ve orijinali değiştirmez", () => {
    const q: Mutation[] = [];
    const q2 = enqueue(q, { kind: "delete", id: "TK-9" });
    expect(q).toHaveLength(0);
    expect(q2).toHaveLength(1);
  });
});

describe("collapse", () => {
  it("aynı talebin art arda durum değişimlerini son değere indirger", () => {
    const q: Mutation[] = [
      { kind: "status", id: "TK-1", status: "open", actor: "A" },
      { kind: "status", id: "TK-1", status: "in_progress", actor: "A" },
      { kind: "status", id: "TK-1", status: "resolved", actor: "A" },
    ];
    const r = collapse(q);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ kind: "status", id: "TK-1", status: "resolved" });
  });

  it("farklı talepleri ayrı tutar", () => {
    const q: Mutation[] = [
      { kind: "status", id: "TK-1", status: "open", actor: "A" },
      { kind: "status", id: "TK-2", status: "closed", actor: "A" },
    ];
    expect(collapse(q)).toHaveLength(2);
  });

  it("create, comment ve delete'i korur", () => {
    const q: Mutation[] = [
      { kind: "create", tempId: "TK-LOCAL-1", input: { title: "x", requester: "y", dept: "z", priority: "low", desc: "", sla: 24 } },
      { kind: "comment", id: "TK-1", text: "not 1", actor: "A" },
      { kind: "comment", id: "TK-1", text: "not 2", actor: "A" },
      { kind: "delete", id: "TK-2" },
    ];
    // comment'ler birleştirilmez (her not anlamlı)
    expect(collapse(q)).toHaveLength(4);
  });

  it("status ve assignee'yi ayrı anahtarlarda birleştirir", () => {
    const q: Mutation[] = [
      { kind: "status", id: "TK-1", status: "open", actor: "A" },
      { kind: "assignee", id: "TK-1", assignee: "E. Yılmaz" },
      { kind: "status", id: "TK-1", status: "resolved", actor: "A" },
      { kind: "assignee", id: "TK-1", assignee: "S. Demir" },
    ];
    const r = collapse(q);
    expect(r).toHaveLength(2);
    expect(r.find((m) => m.kind === "status")).toMatchObject({ status: "resolved" });
    expect(r.find((m) => m.kind === "assignee")).toMatchObject({ assignee: "S. Demir" });
  });
});

describe("pruneForDeleted", () => {
  it("silinen talebe ait bekleyen güncellemeleri kaldırır", () => {
    const q: Mutation[] = [
      { kind: "status", id: "TK-1", status: "open", actor: "A" },
      { kind: "comment", id: "TK-2", text: "kalsın", actor: "A" },
      { kind: "assignee", id: "TK-1", assignee: "E. Yılmaz" },
    ];
    const r = pruneForDeleted(q, "TK-1");
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ id: "TK-2" });
  });

  it("silme mutasyonunun kendisini korur", () => {
    const q: Mutation[] = [{ kind: "delete", id: "TK-1" }];
    expect(pruneForDeleted(q, "TK-1")).toHaveLength(1);
  });
});
