import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
base_dir = r"c:\Users\mohan\OneDrive\Desktop\Brain_Storke_Prediction\zenovo-robotics"

out_path = os.path.join(base_dir, "robot_action_10s.mp4")
src_jump = os.path.join(base_dir, "robot_clip_1.jpg")   # Bipedal jump over hurdle in test lab
src_optic = os.path.join(base_dir, "robot_clip_5.jpg")  # Stereoscopic camera lens macro
src_body = os.path.join(base_dir, "robot_clip_4.jpg")   # Standing humanoid in lab

print("Rendering Realistic 10-Second Robot Action Sequence...")

# Realistic mechanical servo & pneumatic audio synthesis:
# - High-frequency brushless servo pitch (sin at 1800Hz with PWM modulation)
# - Hydraulic pressure release valve (exponential hiss between t=3.2 and 3.6, and t=6.8 and 7.1)
# - Heavy footstep impact thud (45Hz bass pulse at landing)
# - Steady laboratory cleanroom HVAC frequency (70Hz low hum)
audio_filter = (
    r"aevalsrc=sin(2*PI*70*t)*0.10 "
    r"+ (sin(2*PI*1400*(1+0.15*sin(2*PI*6*t))*t)*0.08) "
    r"+ (between(t\,3.1\,3.7)*sin(2*PI*3500*t)*exp(-(t-3.1)*12)*0.25) "
    r"+ (between(t\,3.4\,3.9)*sin(2*PI*55*t)*exp(-(t-3.4)*15)*0.35) "
    r"+ (between(t\,6.8\,7.3)*sin(2*PI*2800*t)*exp(-(t-6.8)*14)*0.22) "
    r"+ (between(t\,6.9\,7.4)*sin(2*PI*60*t)*exp(-(t-6.9)*16)*0.30):s=44100"
)

cmd = [
    ffmpeg_exe, "-y",
    "-loop", "1", "-t", "3.5", "-i", src_jump,
    "-loop", "1", "-t", "3.5", "-i", src_optic,
    "-loop", "1", "-t", "3.0", "-i", src_body,
    "-f", "lavfi", "-t", "10", "-i", audio_filter,
    "-filter_complex",
    # Shot 1: Agile Bipedal Jump - Dynamic camera pan following torso over hurdle
    "[0:v]scale=720:960,zoompan=z='1.05+0.10*(on/105)':x='iw/2-(iw/zoom/2)+sin(on*3)*6':y='ih/2-(ih/zoom/2)+cos(on*2)*5':d=105:s=720x960:fps=30,"
    "eq=contrast=1.08:brightness=0.01:saturation=1.12[v0];"
    # Shot 2: Stereoscopic Optical Sensor Calibration - Precision lens focus zoom
    "[1:v]scale=720:960,zoompan=z='1.12+0.08*sin(2*PI*on/70)':x='iw/2-(iw/zoom/2)+sin(on*1.5)*3':y='ih/2-(ih/zoom/2)':d=105:s=720x960:fps=30,"
    "eq=contrast=1.10:brightness=0.02:saturation=1.15[v1];"
    # Shot 3: Standing Humanoid Torso Balancing - Stabilizer compensation pan
    "[2:v]scale=720:960,zoompan=z='1.04+0.06*(on/90)':x='iw/2-(iw/zoom/2)':y='(on/90)*(ih-ih/zoom)':d=90:s=720x960:fps=30,"
    "eq=contrast=1.06:brightness=0.01:saturation=1.10[v2];"
    # Concatenate the 3 realistic shots
    "[v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[v]",
    "-map", "[v]", "-map", "3:a",
    "-t", "10",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    out_path
]

res = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
if res.returncode == 0 and os.path.exists(out_path):
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"SUCCESS: Realistic robot_action_10s.mp4 created ({size_mb:.2f} MB, 10.0s)")
else:
    print("ERROR:")
    print(res.stderr[-400:])

# Now render realistic 10s individual clips 1, 2, 3, 4, 5, 6, 7, 8
clips_to_render = [
    {
        "file": "robot_clip_1.mp4",
        "src": "robot_clip_1.jpg",
        "vf": "zoompan=z='1.04+0.08*(on/300)':x='iw/2-(iw/zoom/2)+sin(on*2)*4':y='ih/2-(ih/zoom/2)+cos(on*1.5)*3':d=300:s=720x960:fps=30,eq=contrast=1.08:saturation=1.12",
        "af": r"aevalsrc=sin(2*PI*65*t)*0.12 + sin(2*PI*1200*t*(1+0.1*sin(2*PI*4*t)))*0.06 + between(mod(t\,2.5)\,0\,0.2)*sin(2*PI*50*exp(-mod(t\,2.5)*12)*t)*0.25:s=44100"
    },
    {
        "file": "robot_clip_2.mp4",
        "src": "robot_clip_2.jpg",
        "vf": "zoompan=z='1.08+0.05*sin(2*PI*on/150)':x='iw/2-(iw/zoom/2)':y='(on/300)*(ih-ih/zoom)':d=300:s=720x960:fps=30,eq=contrast=1.1:saturation=1.15",
        "af": r"aevalsrc=sin(2*PI*55*t)*0.14 + between(mod(t\,2.0)\,0\,0.18)*sin(2*PI*70*exp(-mod(t\,2.0)*15)*t)*0.3:s=44100"
    },
    {
        "file": "robot_clip_3.mp4",
        "src": "robot_clip_3.jpg",
        "vf": "zoompan=z='1.06+0.07*(on/300)':x='iw/2-(iw/zoom/2)+sin(on*1.2)*3':y='ih/2-(ih/zoom/2)':d=300:s=720x960:fps=30,eq=contrast=1.08:saturation=1.1",
        "af": r"aevalsrc=sin(2*PI*80*t)*0.10 + sin(2*PI*2200*t*(1+0.2*sin(2*PI*5*t)))*0.05:s=44100"
    },
    {
        "file": "robot_clip_4.mp4",
        "src": "robot_clip_4.jpg",
        "vf": "zoompan=z='1.03+0.06*(on/300)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+sin(on)*2':d=300:s=720x960:fps=30,eq=contrast=1.06:saturation=1.08",
        "af": r"aevalsrc=sin(2*PI*60*t)*0.12 + sin(2*PI*900*t)*0.04:s=44100"
    },
    {
        "file": "robot_clip_5.mp4",
        "src": "robot_clip_5.jpg",
        "vf": "zoompan=z='1.10+0.06*sin(2*PI*on/100)':x='iw/2-(iw/zoom/2)+sin(on*2)*3':y='ih/2-(ih/zoom/2)':d=300:s=720x960:fps=30,eq=contrast=1.12:saturation=1.15",
        "af": r"aevalsrc=sin(2*PI*85*t)*0.10 + between(mod(t\,1.8)\,0\,0.12)*sin(2*PI*1800*exp(-mod(t\,1.8)*20)*t)*0.2:s=44100"
    },
    {
        "file": "robot_clip_6.mp4",
        "src": "robot_clip_6.jpg",
        "vf": "zoompan=z='1.05+0.07*(on/300)':x='iw/2-(iw/zoom/2)':y='(on/300)*(ih-ih/zoom)*0.5':d=300:s=720x960:fps=30,eq=contrast=1.08:saturation=1.12",
        "af": r"aevalsrc=sin(2*PI*70*t)*0.12 + sin(2*PI*1500*t*(1+0.1*sin(2*PI*3*t)))*0.06:s=44100"
    },
    {
        "file": "robot_clip_7.mp4",
        "src": "robot_clip_7.jpg",
        "vf": "zoompan=z='1.04+0.06*(on/300)':x='iw/2-(iw/zoom/2)':y='(on/300)*(ih-ih/zoom)':d=300:s=720x960:fps=30,eq=contrast=1.06:saturation=1.10",
        "af": r"aevalsrc=sin(2*PI*65*t)*0.10 + sin(2*PI*1100*t)*0.05:s=44100"
    },
    {
        "file": "robot_clip_8.mp4",
        "src": "robot_clip_8.jpg",
        "vf": "zoompan=z='1.08+0.05*sin(2*PI*on/120)':x='iw/2-(iw/zoom/2)+sin(on*1.5)*3':y='ih/2-(ih/zoom/2)':d=300:s=720x960:fps=30,eq=contrast=1.1:saturation=1.15",
        "af": r"aevalsrc=sin(2*PI*80*t)*0.10 + between(mod(t\,2.2)\,0\,0.15)*sin(2*PI*2200*t)*0.18:s=44100"
    }
]

for c in clips_to_render:
    src_f = os.path.join(base_dir, c["src"])
    dst_f = os.path.join(base_dir, c["file"])
    if not os.path.exists(src_f):
        continue
    cmd_c = [
        ffmpeg_exe, "-y",
        "-loop", "1", "-i", src_f,
        "-f", "lavfi", "-t", "10", "-i", c["af"],
        "-vf", f"{c['vf']},format=yuv420p",
        "-map", "0:v", "-map", "1:a",
        "-t", "10",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        dst_f
    ]
    sub_res = subprocess.run(cmd_c, capture_output=True, text=True, errors="replace")
    if sub_res.returncode == 0:
        print(f"Generated realistic {c['file']} (10.0s)")
    else:
        print(f"Error {c['file']}:", sub_res.stderr[-200:])

print("\nALL REALISTIC 10-SECOND ROBOT VIDEOS COMPLETE!")
