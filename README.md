# Application Load Balancer Visual

**#BuildwithGaurav** · A no-build, beginner-friendly animated walkthrough of an AWS Application Load Balancer (ALB).

## What is this?

This project follows Ravi's online shop as customer requests travel from the internet to a web server. The ALB is explained as a receptionist: it accepts HTTP/HTTPS requests and forwards them to healthy registered targets based on listener rules.

The visual is a **learning simulation**, not a live AWS deployment. It uses plain HTML, CSS, JavaScript, and an inline SVG. There are no JavaScript dependencies, bundlers, or build steps. The Bricolage Grotesque font is loaded from Google Fonts when internet access is available; system fonts are used as fallback.

## AWS concepts covered

- **Amazon Route 53 / DNS:** resolves the shop's domain to the ALB endpoint. DNS lookup itself does not select an EC2 target per request.
- **Application Load Balancer:** operates at Layer 7 and supports HTTP/HTTPS routing.
- **Listeners and rules:** listeners accept connections on ports such as 80 (HTTP) and 443 (HTTPS), then apply default or rule-based actions.
- **Target groups:** hold registered targets and define health-check settings.
- **Availability Zones:** targets can run across multiple enabled Availability Zones for resilience.
- **Health checks:** ALB health checks help determine which targets are eligible to receive normal traffic.
- **Auto Scaling:** an Auto Scaling Group can add EC2 capacity and register instances with a target group. New instances need to become healthy before normal routing.
- **TLS termination:** an HTTPS listener can terminate TLS at the ALB using a configured certificate; traffic from ALB to targets has its own configuration and security considerations.
- **Security groups:** a common design allows web traffic to the ALB and allows target traffic to EC2 only from the ALB security group.
- **Amazon CloudWatch:** can collect ALB/target metrics and support alarms and monitoring.

## The nine steps

1. **Visitors** — customers open Ravi's online shop.
2. **DNS** — Route 53 resolves the domain to the ALB.
3. **Application Load Balancer** — the receptionist accepts requests.
4. **Listener** — HTTP/HTTPS ports and listener rules are introduced.
5. **Target Group** — two EC2 web servers are registered across two Availability Zones.
6. **Traffic Distribution** — requests flow to healthy targets and responses return to the customer.
7. **Health Checks** — simulate a failed server and observe traffic routing to healthy targets.
8. **Scaling** — reveal a third EC2 instance as new Auto Scaling capacity.
9. **Complete Architecture** — combine the request path with security groups, TLS termination, and CloudWatch monitoring.

Use the numbered navigation to jump to a step. Play auto-advances every five seconds; Pause stops the timer and Reset returns to the first step and clears the failure simulation.

## Moving-object legend

- **Envelope:** incoming HTTP/HTTPS request.
- **Shopping cart:** customer request being routed.
- **Green package/check:** response from a server.
- **Green check:** healthy target.
- **Red cross:** unhealthy target.
- **Gold shield:** HTTPS/TLS concept.
- **Chart bars:** CloudWatch monitoring activity.

The SVG uses named paths and `<animateMotion>` with `<mpath>` to move illustrative packets. The picture is intentionally simplified to stay readable at laptop and mobile sizes. On narrow screens, swipe horizontally within the diagram to inspect the whole architecture.

## Local setup

Requirements: Python 3 (only for the local static server).

```bash
cd application-load-balancer-visual
python3 -m http.server 8000
```

Open <http://localhost:8000> in your browser. You can also open `index.html` directly, but using a local HTTP server more closely matches hosting behavior.

## GitHub Pages deployment

1. Create a public GitHub repository named `application-load-balancer-visual` and upload the contents of this folder (not the enclosing ZIP).
2. In the repository, open **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
3. Wait for the Pages deployment to finish and open the published URL shown in the Pages settings.

The included `.nojekyll` file asks GitHub Pages not to run Jekyll processing on the static project.

## Project structure

```text
application-load-balancer-visual/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .nojekyll
├── LICENSE
└── README.md
```

## Customisation

- **Steps and narration:** edit the `steps` array in `js/app.js`.
- **Timing:** change the `5000` millisecond interval in `startTimer()`.
- **Colors and responsive layout:** edit CSS variables and media queries in `css/style.css`.
- **Diagram geometry:** edit the inline SVG in `index.html`. Keep wires before node groups and moving packets after the nodes to preserve the intended visual stacking order.
- **Branding:** search for `#BuildwithGaurav` and update the text as desired.
- **Architecture detail:** add or adjust SVG nodes and paths to suit your learning objectives.

## Accessibility

Controls are native buttons with accessible names, the SVG has a title and description, the caption uses a live region, keyboard focus is visible, and `prefers-reduced-motion` is respected by reducing animations and disabling moving packets.

## Accuracy note

This project explains common ALB patterns, not every AWS configuration. Exact routing behavior depends on listener rules, target type, health-check configuration, cross-zone settings, security groups, and other deployment choices. The failure and scaling controls are local UI simulations; they do not create, stop, or modify AWS resources.

## License

MIT — see [LICENSE](LICENSE).
