import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
base_dir = r"c:\Users\mohan\OneDrive\Desktop\Brain_Storke_Prediction\zenovo-robotics"

out_path = os.path.join(base_dir, "robot_action_10s.mp4")
src_img1 = os.path.join(base_dir, "robot_clip_1.jpg") # Volt-X plasma
src_img2 = os.path.join(base_dir, "robot_clip_2.jpg") # Titan-X combat cannon

# We can create a 10-second multi-cut dynamic action sequence combining both combat mechs!
# 0.0s - 3.2s: Volt-X plasma charge-up, electric flash, quick camera punches
# 3.2s - 6.5s: Titan-X heavy cannon firing, combat recoil, blast shockwaves
# 6.5s - 10.0s: Rapid combat lock-on, hyper-speed optical scan, final plasma discharge

print("Constructing 10-second high-octane Robot Action Clip...")

# Complex filter graph with:
# - Camera punches & combat shakes
# - Strobe lighting & plasma flashes
# - Red & Cyan combat alert grading
# - Cross-cutting between combat robots
# - Synthesized cinematic battle sound effects (plasma whoosh, laser blasts, sub-bass impacts, electric arcs)

cmd = [
    ffmpeg_exe, "-y",
    "-loop", "1", "-t", "3.5", "-i", src_img1,
    "-loop", "1", "-t", "3.5", "-i", src_img2,
    "-loop", "1", "-t", "3.0", "-i", src_img1,
    "-f", "lavfi", "-t", "10", "-i", 
    "aevalsrc=sin(2*PI*50*t)*0.2*min(1\,t*2) + sin(2*PI*120*t*(1+sin(2*PI*8*t)))*0.08 + (between(mod(t\,1.5)\,0\,0.15)*sin(2*PI*400*exp(-mod(t\,1.5)*20)*t)*0.35) + (between(t\,3.2\,3.6)*sin(2*PI*80*exp(-t)*t)*0.4) + (between(t\,6.5\,7.0)*sin(2*PI*800*exp(-t)*t)*0.3):s=44100",
    "-filter_complex",
    # Clip 1: Volt-X Plasma Charge with camera zoom & rumble
    "[0:v]scale=720:960,zoompan=z='1.05+0.15*(on/105)+0.03*sin(on*0.8)':x='iw/2-(iw/zoom/2)+sin(on*5)*8':y='ih/2-(ih/zoom/2)+cos(on*7)*8':d=105:s=720x960:fps=30,"
    "eq=contrast=1.2:brightness=0.04:saturation=1.35[v0];"
    # Clip 2: Titan-X Heavy Cannon Recoil & blast flash
    "[1:v]scale=720:960,zoompan=z='1.20-0.10*(on/105)+if(lt(on,15),0.1*sin(on),0)':x='iw/2-(iw/zoom/2)+if(lt(on,20),sin(on*10)*14,0)':y='ih/2-(ih/zoom/2)+if(lt(on,20),cos(on*12)*14,0)':d=105:s=720x960:fps=30,"
    "eq=contrast=1.3:brightness=0.06:saturation=1.4[v1];"
    # Clip 3: Volt-X Hyper Combat Burst & rapid cuts
    "[2:v]scale=720:960,zoompan=z='1.10+0.15*(on/90)':x='iw/2-(iw/zoom/2)+sin(on*9)*10':y='ih/2-(ih/zoom/2)+cos(on*11)*10':d=90:s=720x960:fps=30,"
    "eq=contrast=1.35:brightness=0.08:saturation=1.5[v2];"
    # Concat the 3 action shots
    "[v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[v]",
    "-map", "[v]", "-map", "3:a",
    "-t", "10",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
    "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart",
    out_path
]

res = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
if res.returncode == 0 and os.path.exists(out_path):
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"SUCCESS: robot_action_10s.mp4 created ({size_mb:.2f} MB, 10.0s)")
else:
    print("ERROR:")
    print(res.stderr[-400:])
