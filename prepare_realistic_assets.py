import os
import subprocess
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
base = r"c:\Users\mohan\OneDrive\Desktop\Brain_Storke_Prediction\zenovo-robotics"
brain = r"C:\Users\mohan\.gemini\antigravity-ide\brain\55399267-64af-45d6-84d4-294545a8ba14"

img_bipedal = os.path.join(brain, "realistic_bipedal_action_1791178197539.jpg")
img_humanoid = os.path.join(brain, "realistic_humanoid_hero_1791178157364.jpg")
img_head = os.path.join(brain, "realistic_robot_head_closeup_1791178177753.jpg")

print("1. Extracting high-res realistic framing crops for all robot clips...")

# Clip 1: Full bipedal dynamic jump
subprocess.run([ffmpeg, "-y", "-i", img_bipedal, "-vf", "scale=720:960:force_original_aspect_ratio=increase,crop=720:960", os.path.join(base, "robot_clip_1.jpg")], check=True)

# Clip 2: Close-up of the hydraulic bipedal legs & shock absorbers
subprocess.run([ffmpeg, "-y", "-i", img_bipedal, "-vf", "crop=iw*0.65:ih*0.5:iw*0.2:ih*0.48,scale=720:960", os.path.join(base, "robot_clip_2.jpg")], check=True)

# Clip 3: Precision articulated robotic hand & carbon forearm
subprocess.run([ffmpeg, "-y", "-i", img_humanoid, "-vf", "crop=iw*0.55:ih*0.45:iw*0.42:ih*0.22,scale=720:960", os.path.join(base, "robot_clip_3.jpg")], check=True)

# Clip 4: Full standing humanoid in test lab
subprocess.run([ffmpeg, "-y", "-i", img_humanoid, "-vf", "scale=720:960:force_original_aspect_ratio=increase,crop=720:960", os.path.join(base, "robot_clip_4.jpg")], check=True)

# Clip 5: Dual stereoscopic optical lenses macro
subprocess.run([ffmpeg, "-y", "-i", img_head, "-vf", "crop=iw*0.68:ih*0.5:iw*0.14:ih*0.3,scale=720:960", os.path.join(base, "robot_clip_5.jpg")], check=True)

# Clip 6: Full macro head & neck cranial structure
subprocess.run([ffmpeg, "-y", "-i", img_head, "-vf", "scale=720:960:force_original_aspect_ratio=increase,crop=720:960", os.path.join(base, "robot_clip_6.jpg")], check=True)

# Clip 7: Flagship hero humanoid
subprocess.run([ffmpeg, "-y", "-i", img_humanoid, "-vf", "scale=720:960:force_original_aspect_ratio=increase,crop=720:960", os.path.join(base, "robot_clip_7.jpg")], check=True)

# Clip 8: Head close-up
subprocess.run([ffmpeg, "-y", "-i", img_head, "-vf", "scale=720:960:force_original_aspect_ratio=increase,crop=720:960", os.path.join(base, "robot_clip_8.jpg")], check=True)

# Action poster
subprocess.run([ffmpeg, "-y", "-i", img_bipedal, "-vf", "scale=720:960:force_original_aspect_ratio=increase,crop=720:960", os.path.join(base, "robot_action_poster.jpg")], check=True)

print("Realistic photo stills generated successfully!")
