import { computeStats, filterTickets, slaForPriority } from "../src/domain/selectors";
import { Ticket } from "../src/types";

const make = (over: Partial<Ticket>): Ticket => ({
  id: "TK-1",
  title: "Test",
  requester: "Ali Veli",
  dept: "BT",
  priority: "medium",
  status: "open",
  assignee: "Atanmadı",
  created: "az önce",
  desc: "",
  sla: 24,
  log: [],
  ...over,
});

const tickets: Ticket[] = [
  make({ id: "TK-1", status: "open", title: "VPN sorunu" }),
  make({ id: "TK-2", status: "open", title: "Yazıcı", requester: "Mehmet" }),
  make({ id: "TK-3", status: "in_progress" }),
  make({ id: "TK-4", status: "resolved" }),
  make({ id: "TK-5", status: "closed" }),
];

describe("computeStats", () => {
  it("durumlara göre doğru sayar", () => {
    expect(computeStats(tickets)).toEqual({ open: 2, progress: 1, resolved: 1, closed: 1 });
  });
  it("boş listede sıfır döner", () => {
    expect(computeStats([])).toEqual({ open: 0, progress: 0, resolved: 0, closed: 0 });
  });
});

describe("filterTickets", () => {
  it("'all' tümünü döndürür", () => {
    expect(filterTickets(tickets, "all", "")).toHaveLength(5);
  });
  it("duruma göre süzer", () => {
    expect(filterTickets(tickets, "open", "")).toHaveLength(2);
  });
  it("başlıkta arama yapar (büyük/küçük harf duyarsız)", () => {
    const r = filterTickets(tickets, "all", "vpn");
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe("TK-1");
  });
  it("talep edene göre arar", () => {
    expect(filterTickets(tickets, "all", "mehmet")[0].id).toBe("TK-2");
  });
  it("#ID ile arar", () => {
    expect(filterTickets(tickets, "all", "TK-3")[0].status).toBe("in_progress");
  });
  it("filtre ve aramayı birlikte uygular", () => {
    expect(filterTickets(tickets, "closed", "vpn")).toHaveLength(0);
  });
});

describe("slaForPriority", () => {
  it("önceliğe göre SLA verir", () => {
    expect(slaForPriority("critical")).toBe(2);
    expect(slaForPriority("high")).toBe(4);
    expect(slaForPriority("medium")).toBe(24);
    expect(slaForPriority("low")).toBe(24);
  });
});
