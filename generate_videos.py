import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
base_dir = r"c:\Users\mohan\OneDrive\Desktop\Brain_Storke_Prediction\zenovo-robotics"

clips = [
    ("robot_clip_1.jpg", "robot_clip_1.mp4", "in"),
    ("robot_clip_2.jpg", "robot_clip_2.mp4", "pan_up"),
    ("robot_clip_3.jpg", "robot_clip_3.mp4", "float"),
    ("robot_clip_4.jpg", "robot_clip_4.mp4", "pan_down"),
    ("robot_clip_5.jpg", "robot_clip_5.mp4", "pulse"),
    ("robot_clip_6.jpg", "robot_clip_6.mp4", "deep"),
    ("zenovo_hero_robot.jpg", "robot_clip_7.mp4", "in"),
    ("zenovo_robot_closeup.jpg", "robot_clip_8.mp4", "focus"),
    ("zenovo_robot_models.jpg", "robot_clip_9.mp4", "sweep"),
    ("zenovo_tech_lab.jpg", "robot_clip_10.mp4", "pan_right"),
]

for src_name, dst_name, motion in clips:
    src_path = os.path.join(base_dir, src_name)
    dst_path = os.path.join(base_dir, dst_name)
    
    if not os.path.exists(src_path):
        print(f"Skipping {src_name} - not found.")
        continue
    
    print(f"\nProcessing {dst_name} from {src_name} ({motion})...")
    
    # Simpler and robust zoompan syntax
    if motion == "in":
        vf = "zoompan=z='min(zoom+0.001,1.25)':d=300:s=720x960:fps=30"
    elif motion == "pan_up":
        vf = "zoompan=z='1.15':y='max(0,ih-ih/zoom-(on/300)*(ih-ih/zoom))':d=300:s=720x960:fps=30"
    elif motion == "pan_down":
        vf = "zoompan=z='1.15':y='(on/300)*(ih-ih/zoom)':d=300:s=720x960:fps=30"
    elif motion == "float":
        vf = "zoompan=z='1.12+0.04*sin(2*PI*on/150)':d=300:s=720x960:fps=30"
    elif motion == "pulse":
        vf = "zoompan=z='1.08+0.07*sin(2*PI*on/100)':d=300:s=720x960:fps=30"
    elif motion == "deep":
        vf = "zoompan=z='min(zoom+0.0008,1.20)':y='(on/300)*(ih-ih/zoom)':d=300:s=720x960:fps=30"
    elif motion == "sweep":
        vf = "zoompan=z='1.15':x='(on/300)*(iw-iw/zoom)':d=300:s=720x960:fps=30"
    elif motion == "pan_right":
        vf = "zoompan=z='1.12':x='(on/300)*(iw-iw/zoom)':d=300:s=720x960:fps=30"
    else:
        vf = "zoompan=z='min(zoom+0.001,1.25)':d=300:s=720x960:fps=30"

    cmd = [
        ffmpeg_exe, "-y",
        "-loop", "1", "-i", src_path,
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-vf", f"{vf},format=yuv420p",
        "-t", "10",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
        "-c:a", "aac", "-b:a", "64k",
        "-movflags", "+faststart",
        dst_path
    ]
    
    proc = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    if proc.returncode == 0 and os.path.exists(dst_path):
        size_mb = os.path.getsize(dst_path) / (1024 * 1024)
        print(f"SUCCESS: {dst_name} ({size_mb:.2f} MB, 10s)")
    else:
        print(f"ERROR on {dst_name}:")
        print(proc.stderr[-400:])

print("\nDONE!")
