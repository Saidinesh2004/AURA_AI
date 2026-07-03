// AURA AI Visual Systems
// Handles HTML5 Canvas backgrounds (neural nodes and 3D spinning globe)

class VisualEngine {
  constructor() {
    this.bgCanvas = null;
    this.bgCtx = null;
    this.globeCanvas = null;
    this.globeCtx = null;
    this.nodes = [];
    this.mouse = { x: null, y: null, maxDist: 200 };
    this.globeRotation = 0;
    this.globePoints = [];
    this.animationFrameId = null;
    this.themeColors = {
      blue: 'rgba(0, 240, 255, 0.4)',
      purple: 'rgba(157, 78, 221, 0.4)',
      blueSolid: '#00f0ff',
      purpleSolid: '#9d4edd'
    };
  }

  initBackground(canvasElement) {
    this.bgCanvas = canvasElement;
    this.bgCtx = this.bgCanvas.getContext('2d');
    this.resizeBackground();
    this.initNodes();

    window.addEventListener('resize', () => this.resizeBackground());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  resizeBackground() {
    if (!this.bgCanvas) return;
    this.bgCanvas.width = window.innerWidth;
    this.bgCanvas.height = window.innerHeight;
    this.initNodes();
  }

  initNodes() {
    if (!this.bgCanvas) return;
    this.nodes = [];
    const nodeCount = Math.min(70, Math.floor((this.bgCanvas.width * this.bgCanvas.height) / 25000));
    
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.bgCanvas.width,
        y: Math.random() * this.bgCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? this.themeColors.blue : this.themeColors.purple
      });
    }
  }

  animateBackground() {
    if (!this.bgCtx || !this.bgCanvas) return;
    this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);

    // Draw cursor glow halo
    if (this.mouse.x !== null) {
      const grad = this.bgCtx.createRadialGradient(
        this.mouse.x, this.mouse.y, 0,
        this.mouse.x, this.mouse.y, this.mouse.maxDist
      );
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
      grad.addColorStop(0.5, 'rgba(157, 78, 221, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.bgCtx.fillStyle = grad;
      this.bgCtx.beginPath();
      this.bgCtx.arc(this.mouse.x, this.mouse.y, this.mouse.maxDist, 0, Math.PI * 2);
      this.bgCtx.fill();
    }

    // Draw neural network lines
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;

      // Boundary bouncing
      if (n1.x < 0 || n1.x > this.bgCanvas.width) n1.vx *= -1;
      if (n1.y < 0 || n1.y > this.bgCanvas.height) n1.vy *= -1;

      // Draw dot
      this.bgCtx.beginPath();
      this.bgCtx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
      this.bgCtx.fillStyle = n1.color;
      this.bgCtx.fill();

      // Connect to other close nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          this.bgCtx.strokeStyle = n1.color.replace('0.4', alpha.toString());
          this.bgCtx.lineWidth = 0.8;
          this.bgCtx.beginPath();
          this.bgCtx.moveTo(n1.x, n1.y);
          this.bgCtx.lineTo(n2.x, n2.y);
          this.bgCtx.stroke();
        }
      }

      // Connect to mouse cursor
      if (this.mouse.x !== null) {
        const mDist = Math.hypot(n1.x - this.mouse.x, n1.y - this.mouse.y);
        if (mDist < this.mouse.maxDist) {
          const alpha = (1 - mDist / this.mouse.maxDist) * 0.55;
          this.bgCtx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.bgCtx.lineWidth = 1.2;
          this.bgCtx.beginPath();
          this.bgCtx.moveTo(n1.x, n1.y);
          this.bgCtx.lineTo(this.mouse.x, this.mouse.y);
          this.bgCtx.stroke();
        }
      }
    }
  }

  // --- 3D Particle Globe ---
  initGlobe(canvasElement) {
    this.globeCanvas = canvasElement;
    this.globeCtx = this.globeCanvas.getContext('2d');
    this.globePoints = [];
    
    const radius = 120;
    const count = 280;
    
    // Generate spherical coordinates (Fibonacci Lattice)
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      this.globePoints.push({ x, y, z });
    }
  }

  animateGlobe() {
    if (!this.globeCanvas || !this.globeCtx) return;
    const ctx = this.globeCtx;
    const width = this.globeCanvas.width;
    const height = this.globeCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    this.globeRotation += 0.003;
    const cosRy = Math.cos(this.globeRotation);
    const sinRy = Math.sin(this.globeRotation);
    const cosRx = Math.cos(this.globeRotation * 0.5);
    const sinRx = Math.sin(this.globeRotation * 0.5);

    // Sort points by Z (depth buffer for correct painter's rendering)
    const projectedPoints = this.globePoints.map(p => {
      // Rotate Y
      let x1 = p.x * cosRy - p.z * sinRy;
      let z1 = p.z * cosRy + p.x * sinRy;
      // Rotate X
      let y2 = p.y * cosRx - z1 * sinRx;
      let z2 = z1 * cosRx + p.y * sinRx;

      // Perspective projection
      const scale = 220 / (220 + z2); // Adjust focal length
      const projX = x1 * scale;
      const projY = y2 * scale;

      return { x: projX, y: projY, z: z2, scale };
    });

    projectedPoints.sort((a, b) => b.z - a.z);

    // Draw lines connecting nearby vertices
    ctx.lineWidth = 0.5;
    for (let i = 0; i < projectedPoints.length; i++) {
      const p1 = projectedPoints[i];
      if (p1.z > 80) continue; // Skip very back points to reduce clutter

      let connections = 0;
      for (let j = i + 1; j < projectedPoints.length; j++) {
        const p2 = projectedPoints[j];
        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        if (distance < 35 && connections < 3) {
          const alpha = (1 - distance / 35) * (0.05 + (p1.z + 120) / 240 * 0.25);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          connections++;
        }
      }
    }

    // Draw particle points
    projectedPoints.forEach(p => {
      // Color depends on depth (cyan in front, purple in back)
      const ratio = (p.z + 120) / 240; // 0 to 1
      const size = Math.max(0.5, p.scale * 2.5);
      
      const r = Math.round(157 * (1 - ratio) + 0 * ratio);
      const g = Math.round(78 * (1 - ratio) + 240 * ratio);
      const b = Math.round(221 * (1 - ratio) + 255 * ratio);
      const alpha = 0.2 + ratio * 0.7;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();

      // Core glow for outer points
      if (ratio > 0.8) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`;
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // Unified Frame Tick
  tick() {
    this.animateBackground();
    this.animateGlobe();
    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

export const visual = new VisualEngine();
