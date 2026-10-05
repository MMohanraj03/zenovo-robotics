import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
base_dir = r"c:\Users\mohan\OneDrive\Desktop\Brain_Storke_Prediction\zenovo-robotics"

out_path = os.path.join(base_dir, "robot_action_10s.mp4")
src_jump = os.path.join(base_dir, "robot_clip_1.jpg")   # Bipedal jump over hurdle in test lab
src_optic = os.path.join(base_dir, "robot_clip_5.jpg")  # Stereoscopic camera lens macro
src_body = os.path.join(base_dir, "robot_clip_4.jpg")   # Standing humanoid in lab

print("Creating realistic 10s multi-cut action video...")

t1 = os.path.join(base_dir, "temp_shot1.mp4")
t2 = os.path.join(base_dir, "temp_shot2.mp4")
t3 = os.path.join(base_dir, "temp_shot3.mp4")

# Shot 1: Bipedal agile hurdle vault (3.5s = 105 frames at 30fps)
cmd1 = [
    ffmpeg_exe, "-y",
    "-loop", "1", "-i", src_jump,
    "-vf", "scale=720:960,zoompan=z='1.05+0.12*(on/105)':x='iw/2-(iw/zoom/2)+sin(on*3)*6':y='ih/2-(ih/zoom/2)+cos(on*2)*5':d=105:s=720x960:fps=30,format=yuv420p",
    "-frames:v", "105",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
    t1
]
subprocess.run(cmd1, check=True)

# Shot 2: Stereoscopic camera lens aperture autofocus (3.5s = 105 frames at 30fps)
cmd2 = [
    ffmpeg_exe, "-y",
    "-loop", "1", "-i", src_optic,
    "-vf", "scale=720:960,zoompan=z='1.10+0.08*sin(2*PI*on/70)':x='iw/2-(iw/zoom/2)+sin(on*1.5)*3':y='ih/2-(ih/zoom/2)':d=105:s=720x960:fps=30,format=yuv420p",
    "-frames:v", "105",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
    t2
]
subprocess.run(cmd2, check=True)

# Shot 3: Whole-body bipedal stabilization (3.0s = 90 frames at 30fps)
cmd3 = [
    ffmpeg_exe, "-y",
    "-loop", "1", "-i", src_body,
    "-vf", "scale=720:960,zoompan=z='1.04+0.06*(on/90)':x='iw/2-(iw/zoom/2)':y='(on/90)*(ih-ih/zoom)':d=90:s=720x960:fps=30,format=yuv420p",
    "-frames:v", "90",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
    t3
]
subprocess.run(cmd3, check=True)

# Realistic acoustic audio track (servo hum, footstep impact, hydraulic valve hiss, clean lab atmosphere)
audio_filter = (
    r"aevalsrc=sin(2*PI*70*t)*0.10 "
    r"+ (sin(2*PI*1400*(1+0.15*sin(2*PI*6*t))*t)*0.08) "
    r"+ (between(t\,3.1\,3.7)*sin(2*PI*3500*t)*exp(-(t-3.1)*12)*0.25) "
    r"+ (between(t\,3.4\,3.9)*sin(2*PI*55*t)*exp(-(t-3.4)*15)*0.35) "
    r"+ (between(t\,6.8\,7.3)*sin(2*PI*2800*t)*exp(-(t-6.8)*14)*0.22) "
    r"+ (between(t\,6.9\,7.4)*sin(2*PI*60*t)*exp(-(t-6.9)*16)*0.30):s=44100"
)

# Concat video and add audio
list_file = os.path.join(base_dir, "concat_list.txt")
with open(list_file, "w") as f:
    f.write(f"file '{t1}'\nfile '{t2}'\nfile '{t3}'\n")

cmd_final = [
    ffmpeg_exe, "-y",
    "-f", "concat", "-safe", "0", "-i", list_file,
    "-f", "lavfi", "-t", "10", "-i", audio_filter,
    "-map", "0:v", "-map", "1:a",
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    out_path
]
res = subprocess.run(cmd_final, capture_output=True, text=True, errors="replace")
if res.returncode == 0:
    sz = os.path.getsize(out_path) / (1024 * 1024)
    print(f"SUCCESS: Realistic robot_action_10s.mp4 created ({sz:.2f} MB, 10.0s)")
else:
    print("Error:", res.stderr[-300:])

# Cleanup temps
for tmp in [t1, t2, t3, list_file]:
    if os.path.exists(tmp):
        try: os.remove(tmp)
        except: pass
