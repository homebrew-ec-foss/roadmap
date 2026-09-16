(() => {
  const roadmap = document.getElementById("roadmap-map");
  if (!roadmap) return;
  const svg = roadmap.querySelector(".roadmap-svg");
  const path = roadmap.querySelector(".road-path");
  let milestones = Array.from(roadmap.querySelectorAll(".milestone"));
  const progressCount = document.getElementById("progress-count");
  const progressBar = document.getElementById("progress-bar");
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  
  function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",})
      .format(date)
      .toUpperCase();
  }

  function sortMilestones() {
    milestones.sort((a, b) =>
      (a.dataset.date || "").localeCompare(b.dataset.date || ""));
    milestones.forEach((milestone, index) => {
      roadmap.appendChild(milestone);
      const number = milestone.querySelector(".node-number");
      if (number) number.textContent = String(index + 1).padStart(2, "0");
      const time = milestone.querySelector("time");
      if (time) time.textContent = formatDate(milestone.dataset.date);
      const rotations = ["-3deg", "2deg", "-1deg", "3deg", "-2deg"];
      milestone.style.setProperty(
        "--node-rotation",
        rotations[index % rotations.length]
      );
    });
  }

  function desktopLayout() {
    const width = roadmap.clientWidth;
    const center = width / 2;
    const sideOffset = Math.min(300, Math.max(180, width * 0.27));
    const topStart = 90;
    const step = Math.max(300,Math.min(390, 1300 / Math.max(1, milestones.length - 1)));
    const points = [];
    milestones.forEach((milestone, index) => {
      let x = center;
      if (index !== 0) {
        x = index % 2 === 1 ? center - sideOffset : center + sideOffset;
      }

      const y = topStart + index * step;
      milestone.classList.remove("left", "right");
      milestone.classList.add(x < center ? "left" : "right");
      milestone.style.left = `${x}px`;
      milestone.style.top = `${y}px`;
      points.push({ x, y });
    });

    const height = points.length ? points[points.length - 1].y + 400 : 600;
    roadmap.style.height = `${height}px`;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    if (!points.length) {
      path.setAttribute("d", "");
      return;
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const previous = points[i - 1];
      const current = points[i];
      const midpoint = (previous.y + current.y) / 2;
      d += ` C ${previous.x} ${midpoint}, ${current.x} ${midpoint}, ${current.x} ${current.y}`;
    }
    path.setAttribute("d", d);
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  }

  function mobileLayout() {
    roadmap.style.height = "auto";
    milestones.forEach((milestone) => {
      milestone.style.left = "";
      milestone.style.top = "";
      milestone.style.removeProperty("--node-rotation");
      milestone.classList.remove("left", "right");
    });
    path.setAttribute("d", "");
  }

  function layout() {
    if (mobileQuery.matches) {
      mobileLayout();
    } else {
      desktopLayout();
    }
  }
  milestones.forEach((milestone) => {
    const node = milestone.querySelector(".milestone-node");
    node.addEventListener("click", () => {
      const url = milestone.dataset.url;
      if (url) window.location.href = url;
    });
  });
  function updateCurrentMilestone() {
    if (!milestones.length) return;
    let closest = milestones[0];
    let closestDistance = Infinity;
    const screenCenter = window.innerHeight / 2;
    milestones.forEach((milestone) => {
      const rect = milestone.getBoundingClientRect();
      const milestoneCenter = rect.top + rect.height / 2;
      const distance = Math.abs(milestoneCenter - screenCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = milestone;
      }
    });
    milestones.forEach((milestone) => {
      milestone.classList.toggle("current", milestone === closest);
    });
    const index = milestones.indexOf(closest);
    const current = String(index + 1).padStart(2, "0");
    const total = String(milestones.length).padStart(2, "0");
    if (progressCount) progressCount.textContent = `${current} / ${total}`;
    if (progressBar) {
      const progress =milestones.length <= 1 ? 100 : (index / (milestones.length - 1)) * 100; progressBar.style.width = `${progress}%`;
    }
  }
  function updatePath() {
    if (mobileQuery.matches) return;
    const rect = roadmap.getBoundingClientRect();
    const viewport = window.innerHeight;
    const total = rect.height;
    const visible = viewport - rect.top;
    let progress = visible / total;
    progress = Math.max(0, Math.min(1, progress));
    const length = path.getTotalLength();
    path.style.strokeDashoffset = length * (1 - progress);
  }

  function update() {
    updateCurrentMilestone();
    updatePath();
  }

  sortMilestones();
  layout();
  update();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      layout();
      update();
    }, 100);
  });
  window.addEventListener("scroll", update, { passive: true });
})();