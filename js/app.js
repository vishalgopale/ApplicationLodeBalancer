(() => {
  "use strict";

  const steps = [
    {
      title: "Visitors arrive at Ravi’s shop", icon: "🛍️",
      plain: "Customers open Ravi’s website, just like walking up to a busy shop.",
      technical: "Client request over HTTP or HTTPS.",
      watch: "The envelope moves in from the internet side. More visitors can arrive at any time.",
      status: "Journey started", reveal: 0
    },
    {
      title: "DNS points customers to the front door", icon: "🔎",
      plain: "A contact list looks up the shop’s address so the browser knows where to go.",
      technical: "Amazon Route 53 DNS record / alias to the ALB.",
      watch: "Route 53 appears above the incoming path. DNS helps find the load balancer; it does not choose an EC2 server for each request.",
      status: "Domain resolved", reveal: 1
    },
    {
      title: "Meet the Application Load Balancer", icon: "🧑‍💼",
      plain: "The receptionist is the single front door. Customers don’t need to know which worker serves them.",
      technical: "Application Load Balancer (Layer 7, HTTP/HTTPS).",
      watch: "The teal ALB node appears. It can route requests using application-level details such as hostnames and URL paths.",
      status: "ALB receives request", reveal: 2
    },
    {
      title: "The listener checks the doorbell", icon: "🔔",
      plain: "The receptionist listens for the right kind of knock, then follows the matching rule.",
      technical: "Listener on port 80 (HTTP) or 443 (HTTPS), with default and rule-based actions.",
      watch: "The gold listener appears between the ALB and target group. HTTPS listeners commonly use a certificate for TLS.",
      status: "Listener evaluates rules", reveal: 3
    },
    {
      title: "A target group lists the workers", icon: "👥",
      plain: "The receptionist has a current list of web servers that may serve the next customer.",
      technical: "Target group with registered EC2 instance targets and health-check settings.",
      watch: "Two EC2 instances appear in separate Availability Zones. The target group is the destination configured in the listener action.",
      status: "Targets registered", reveal: 4
    },
    {
      title: "Requests are shared across healthy servers", icon: "🛒",
      plain: "Instead of sending every customer to one worker, the receptionist spreads requests across available workers.",
      technical: "ALB routing to healthy registered targets across enabled Availability Zones.",
      watch: "The cart follows the routing path and a package returns. Load balancing distributes requests, not necessarily an equal number to every server.",
      status: "Traffic flowing", reveal: 5
    },
    {
      title: "Health checks spot a server problem", icon: "🩺",
      plain: "The receptionist checks who is ready. If a worker is sick, new customers are sent to a healthy worker instead.",
      technical: "Target-group health checks; unhealthy targets are generally removed from normal routing.",
      watch: "Use “Simulate EC2 failure” to turn Web 1 red. New requests are rerouted to healthy targets. Real behavior depends on health-check settings and healthy targets remaining.",
      status: "Health checks active", reveal: 6
    },
    {
      title: "Auto Scaling adds another worker", icon: "📈",
      plain: "When demand grows, an Auto Scaling Group can add another server to help with the queue.",
      technical: "EC2 Auto Scaling Group registers a new instance; the target must pass health checks before receiving normal traffic.",
      watch: "EC2 Web 3 joins the diagram. The sample animation marks it in service; in AWS, launch, registration, and health checks take time.",
      status: "Capacity expanded", reveal: 7
    },
    {
      title: "The complete architecture", icon: "☁️",
      plain: "Customers find the front door, the ALB checks each request, healthy servers do the work, and monitoring helps the team notice issues.",
      technical: "Route 53 → ALB → listener/rules → target group → EC2 targets; security groups, TLS, and CloudWatch.",
      watch: "Security groups show the intended traffic boundary, TLS termination is highlighted, and CloudWatch represents metrics and alarms. This is a learning diagram, not a deployed AWS environment.",
      status: "Architecture overview", reveal: 8
    }
  ];

  const $ = (selector) => document.querySelector(selector);
  const stepButtons = [...document.querySelectorAll(".step-button")];
  const nodes = [...document.querySelectorAll(".node[data-reveal]")];
  const packets = [...document.querySelectorAll(".packet[data-reveal]")];
  const wires = [...document.querySelectorAll(".wire")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentStep = 0;
  let timer = null;
  let playing = !reducedMotion.matches;
  let failedServer = false;

  const revealUpTo = (step) => {
    nodes.forEach((node) => node.classList.toggle("revealed", Number(node.dataset.reveal) <= step));
    packets.forEach((packet) => packet.classList.toggle("revealed", Number(packet.dataset.reveal) <= step));
    wires.forEach((wire) => {
      const isAdvanced = wire.classList.contains("target-wire") || wire.classList.contains("response-wire") || wire.classList.contains("monitoring-wire");
      wire.classList.toggle("active", step >= 5 && isAdvanced);
      wire.classList.toggle("inactive", isAdvanced && step < 4);
    });
    $("#nodeDNS").classList.toggle("revealed", step >= 1);
    $("#nodeALB").classList.toggle("revealed", step >= 2);
    $("#nodeListener").classList.toggle("revealed", step >= 3);
    $("#nodeGroup").classList.toggle("revealed", step >= 4);
    $("#azA").classList.toggle("revealed", step >= 4);
    $("#azB").classList.toggle("revealed", step >= 4);
    $("#server1").classList.toggle("revealed", step >= 4);
    $("#server2").classList.toggle("revealed", step >= 4);
    $("#server3").classList.toggle("revealed", step >= 7);
    $("#nodeTLS").classList.toggle("revealed", step >= 8);
    $("#nodeSecurity").classList.toggle("revealed", step >= 8);
    $("#nodeCloudWatch").classList.toggle("revealed", step >= 8);
    document.querySelector(".third-wire").style.opacity = step >= 7 ? "1" : ".3";
    document.querySelector(".monitoring-wire").style.opacity = step >= 8 ? "1" : ".15";
    document.querySelector(".packet-cart").style.opacity = step >= 5 ? "1" : "0";
    document.querySelector(".packet-response").style.opacity = step >= 5 ? "1" : "0";
    document.querySelector(".packet-shield").style.opacity = step >= 8 ? "1" : "0";
  };

  function renderStep(step) {
    currentStep = Math.max(0, Math.min(steps.length - 1, step));
    const data = steps[currentStep];
    revealUpTo(currentStep);
    stepButtons.forEach((button, index) => {
      const active = index === currentStep;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "step" : "false");
    });
    $("#stepCount").textContent = `${String(currentStep + 1).padStart(2, "0")} / 09`;
    $("#progressBar").style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    $("#diagramTitle").textContent = `${String(currentStep + 1).padStart(2, "0")} · ${[
      "Customers arrive", "Find the front door", "Meet the ALB", "Check the doorbell",
      "List available workers", "Share the workload", "Check server health", "Add capacity", "Full architecture"
    ][currentStep]}`;
    $("#statusText").textContent = data.status;
    $("#captionIcon").textContent = data.icon;
    $("#captionStep").textContent = `STEP ${String(currentStep + 1).padStart(2, "0")} OF 09`;
    $("#captionTitle").textContent = data.title;
    $("#plainWords").textContent = data.plain;
    $("#technicalName").textContent = data.technical;
    $("#watchPicture").textContent = data.watch;
    if (currentStep >= 6 && failedServer) $("#statusText").textContent = "Unhealthy target bypassed";
  }

  function stopTimer() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
  }
  function startTimer() {
    stopTimer();
    playing = true;
    $("#playBtn").textContent = "▶ Playing";
    timer = window.setInterval(() => renderStep((currentStep + 1) % steps.length), 5000);
  }
  function pause() {
    stopTimer();
    playing = false;
    $("#playBtn").textContent = "▶ Play";
  }

  stepButtons.forEach((button) => button.addEventListener("click", () => {
    renderStep(Number(button.dataset.step));
  }));
  $("#playBtn").addEventListener("click", startTimer);
  $("#pauseBtn").addEventListener("click", pause);
  $("#resetBtn").addEventListener("click", () => {
    pause();
    failedServer = false;
    document.body.classList.remove("server-failed");
    $("#failureBtn").classList.remove("failed");
    $("#failureBtn").textContent = "⚡ Simulate EC2 failure";
    $("#server1 .node-sub").textContent = "Healthy";
    $("#server1 .healthy-label").textContent = "● IN SERVICE";
    renderStep(0);
  });
  $("#themeToggle").addEventListener("click", () => {
    const light = document.body.classList.toggle("is-light");
    $("#themeToggle").setAttribute("aria-pressed", String(light));
    $("#themeToggle").innerHTML = light ? "☾ <span>Theme</span>" : "☼ <span>Theme</span>";
  });
  $("#failureBtn").addEventListener("click", () => {
    failedServer = !failedServer;
    document.body.classList.toggle("server-failed", failedServer);
    $("#failureBtn").classList.toggle("failed", failedServer);
    $("#failureBtn").textContent = failedServer ? "✓ Restore EC2 Web 1" : "⚡ Simulate EC2 failure";
    $("#server1 .node-sub").textContent = failedServer ? "Unhealthy" : "Healthy";
    $("#server1 .healthy-label").textContent = failedServer ? "✕ OUT OF SERVICE" : "● IN SERVICE";
    if (currentStep < 6) renderStep(6);
    else renderStep(currentStep);
    $("#statusText").textContent = failedServer ? "Rerouting to healthy targets" : "Health check passed · target restored";
    $("#watchPicture").textContent = failedServer
      ? "EC2 Web 1 is red and no longer receives normal new requests. The ALB can route to healthy registered targets; this demo keeps Web 2 available."
      : "A successful simulated health check restores EC2 Web 1 to the healthy state. In a real target group, AWS health checks determine when the target is eligible for routing.";
  });

  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      pause();
      packets.forEach((packet) => packet.classList.remove("revealed"));
    }
  });

  renderStep(0);
  if (playing) startTimer();
  else pause();
})();
