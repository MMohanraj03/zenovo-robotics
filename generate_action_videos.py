import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
base_dir = r"c:\Users\mohan\OneDrive\Desktop\Brain_Storke_Prediction\zenovo-robotics"

# Definitions for intense action video clips
action_configs = [
    {
        "src": "robot_clip_1.jpg",
        "dst": "robot_clip_1.mp4",
        "name": "Volt-X Plasma Strike",
        # Plasma bursts, high-speed camera punches, electric shake
        "vf": "zoompan=z='1.08+0.12*(on/300)+0.04*sin(on*0.9)':x='iw/2-(iw/zoom/2)+sin(on*6)*9':y='ih/2-(ih/zoom/2)+cos(on*8)*9':d=300:s=720x960:fps=30,eq=contrast=1.3:brightness=0.05:saturation=1.45",
        # Synthesized plasma charge, laser crackle, sub hum
        "af": "aevalsrc=sin(2*PI*60*t)*0.18 + sin(2*PI*120*t*(1+sin(2*PI*12*t)))*0.12 + between(mod(t\,1.2)\,0\,0.12)*sin(2*PI*500*exp(-mod(t\,1.2)*25)*t)*0.35:s=44100"
    },
    {
        "src": "robot_clip_2.jpg",
        "dst": "robot_clip_2.mp4",
        "name": "Titan-X Heavy Siege Blast",
        # Heavy recoil camera shakes at intervals, shockwave pushback
        "vf": "zoompan=z='1.15-0.08*(on/300)+if(lt(mod(on\,75)\,12)\,0.08*sin(on*3)\,0)':x='iw/2-(iw/zoom/2)+if(lt(mod(on\,75)\,15)\,sin(on*14)*14\,0)':y='ih/2-(ih/zoom/2)+if(lt(mod(on\,75)\,15)\,cos(on*16)*14\,0)':d=300:s=720x960:fps=30,eq=contrast=1.35:brightness=0.04:saturation=1.4",
        # Heavy cannon blasts every 2.5 seconds + mechanical rumble
        "af": "aevalsrc=sin(2*PI*45*t)*0.22 + between(mod(t\,2.5)\,0\,0.2)*sin(2*PI*70*exp(-mod(t\,2.5)*15)*t)*0.45:s=44100"
    },
    {
        "src": "robot_clip_3.jpg",
        "dst": "robot_clip_3.mp4",
        "name": "Aura-S Orbital Thruster Burst",
        "vf": "zoompan=z='1.10+0.06*sin(2*PI*on/120)':x='iw/2-(iw/zoom/2)+sin(on*1.5)*6':y='ih/2-(ih/zoom/2)+cos(on*2)*6':d=300:s=720x960:fps=30,eq=contrast=1.2:brightness=0.04:saturation=1.3",
        "af": "aevalsrc=sin(2*PI*80*t)*0.15 + sin(2*PI*240*t)*0.06*sin(2*PI*0.5*t):s=44100"
    },
    {
        "src": "robot_clip_4.jpg",
        "dst": "robot_clip_4.mp4",
        "name": "Titan-IV Hydraulic Piston Action",
        # High-power hydraulic stomps with vertical tremor
        "vf": "zoompan=z='1.14':x='iw/2-(iw/zoom/2)':y='(on/300)*(ih-ih/zoom)+if(lt(mod(on\,60)\,8)\,sin(on*12)*12\,0)':d=300:s=720x960:fps=30,eq=contrast=1.3:brightness=0.03:saturation=1.35",
        "af": "aevalsrc=sin(2*PI*40*t)*0.25 + between(mod(t\,2.0)\,0\,0.15)*sin(2*PI*50*exp(-mod(t\,2.0)*18)*t)*0.4:s=44100"
    },
    {
        "src": "robot_clip_5.jpg",
        "dst": "robot_clip_5.mp4",
        "name": "Nano-Core High-Speed Swarm",
        # Hyper-frequency shimmer and molecular vibration
        "vf": "zoompan=z='1.08+0.08*sin(2*PI*on/60)':x='iw/2-(iw/zoom/2)+sin(on*15)*5':y='ih/2-(ih/zoom/2)+cos(on*18)*5':d=300:s=720x960:fps=30,eq=contrast=1.35:brightness=0.06:saturation=1.45",
        "af": "aevalsrc=sin(2*PI*140*t*(1+sin(2*PI*16*t)))*0.14 + sin(2*PI*880*t)*0.04*sin(2*PI*3*t):s=44100"
    },
    {
        "src": "robot_clip_6.jpg",
        "dst": "robot_clip_6.mp4",
        "name": "Deep-7 Abyssal Trench Sonar",
        "vf": "zoompan=z='min(zoom+0.0009,1.22)':y='(on/300)*(ih-ih/zoom)+sin(on*1.2)*5':d=300:s=720x960:fps=30,eq=contrast=1.25:brightness=0.03:saturation=1.35",
        "af": "aevalsrc=sin(2*PI*35*t)*0.2 + between(mod(t\,3.0)\,0\,0.2)*sin(2*PI*750*exp(-mod(t\,3.0)*8)*t)*0.25:s=44100"
    }
]

for cfg in action_configs:
    src_path = os.path.join(base_dir, cfg["src"])
    dst_path = os.path.join(base_dir, cfg["dst"])
    if not os.path.exists(src_path):
        continue
    
    print(f"\nRendering Action Clip: {cfg['name']} -> {cfg['dst']} (10.0s)...")
    cmd = [
        ffmpeg_exe, "-y",
        "-loop", "1", "-i", src_path,
        "-f", "lavfi", "-t", "10", "-i", cfg["af"],
        "-vf", f"{cfg['vf']},format=yuv420p",
        "-map", "0:v", "-map", "1:a",
        "-t", "10",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
        "-c:a", "aac", "-b:a", "96k",
        "-movflags", "+faststart",
        dst_path
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    if proc.returncode == 0 and os.path.exists(dst_path):
        size_mb = os.path.getsize(dst_path) / (1024 * 1024)
        print(f"SUCCESS: {cfg['dst']} ({size_mb:.2f} MB, 10.0s)")
    else:
        print("ERROR:", proc.stderr[-300:])

print("\nALL ROBOT ACTION CLIPS READY!")
